"use client"

import { group } from "node:console";
import { useEffect, useRef, useState, useCallback } from "react";
import io, { Socket } from "socket.io-client";

// On definit le type de message
export interface Message {
    id: string
    content: string
    sender: {
        id: number
        username: string
    }
    timestamp: Date
}

// les evenements du serveur vers le client
interface ServerToClientEvents {
    'new-message': (message: Message, groupId: number) => void
    'error': (error: string) => void
}

// les evenements du client vers le serveur
interface ClientToServerEvents {
    'join-group': (groupId: number) => void
    'leave-group': (groupId: number) => void
    'send-message': (data: { message: Message, groupId: number }) => void
    'identify': (user: { id: number, username: string }) => void
}

export interface UseSocketReturn {
    isConnected: boolean;
    error: string | null;
    joinGroup: (groupId: number) => void;
    leaveGroup: (groupId: number) => void;
    sendMessage: (message: Message, groupId: number) => boolean;
    listenForMessages: (callback: (message: Message, groupId: number) => void) => () => void;
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
}

// instance de socket singleton
let socketInstance: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
let socketInitialized = false;

export function useSocket(): UseSocketReturn {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(socketInstance);
    const callbackRef = useRef<((message: Message, groupId: number) => void) | null>(null);

    // initialisation du socket
    useEffect(() => {
        const initSocket = async () => {
            if (socketInitialized || socketRef.current) {
                return;
            }

            try {
                socketInitialized = true;

                // on utilise fetch pour initialiser le socket
                await fetch('/api/socket');
                console.log('Socket API initialized');


                const socket = io({
                    path: '/api/socketio',
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                    timeout: 10000,
                });


                socketRef.current = socket as Socket<ServerToClientEvents, ClientToServerEvents>;
                socketInstance = socket as Socket<ServerToClientEvents, ClientToServerEvents>;

                socket.on('connect', async () => {
                    setIsConnected(true);
                    setError(null);

                    // recuperer l'utilisateur de la session
                    try {
                        const response = await fetch('/api/sessionUser');
                        if (response.ok) {
                            const userData = await response.json();
                            if (userData.id) {
                                socket.emit('identify', {
                                    id: typeof userData.id === 'string' ? parseInt(userData.id) : userData.id,
                                    username: userData.name || userData.username || 'User'
                                });
                            }
                        }
                    } catch (e) {
                        console.error('Failed to get user data for socket:', e);
                    }
                });

                // gerer les nouveaux messages
                socket.on('new-message', (message: Message, groupId: number) => {
                    if (callbackRef.current) {
                        callbackRef.current(message, groupId);
                    } else {
                        console.warn('Socket message received but no callback is registered');
                    }
                });

                socket.on('disconnect', (reason) => {
                    setIsConnected(false);
                });

                socket.on('error', (err) => {
                    console.error('Socket error:', err);
                    setError(err);
                });

                socket.on('connect_error', (err) => {
                    console.error('Socket connection error:', err);
                    setError(err.message);
                });

            } catch (err) {
                console.error('Failed to initialize socket:', err);
                setError(err instanceof Error ? err.message : 'Unknown socket error');
                socketInitialized = false;
            }
        };

        initSocket();

        if (socketInstance && socketInstance.connected) {
            socketRef.current = socketInstance;
            setIsConnected(true);
        }
        return () => {
            callbackRef.current = null;
        };
    }, []);

    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && window.onbeforeunload) {
                if (socketInstance) {
                    socketInstance.disconnect();
                    socketInstance = null;
                    socketInitialized = false;
                }
            }
        };
    }, []);

    const joinGroup = useCallback((groupId: number) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit('join-group', groupId);
        } else {
            console.warn(`Cannot join group ${groupId}: Socket not connected`);
        }
    }, [isConnected]);

    const leaveGroup = useCallback((groupId: number) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit('leave-group', groupId);
        } else {
            console.warn(`Cannot leave group ${groupId}: Socket not connected`);
        }
    }, [isConnected]);

    const sendMessage = useCallback((message: Message, groupId: number) => {
        if (!socketRef.current || !isConnected) {
            console.warn('Cannot send message: Socket not connected');
            return false;
        }

        socketRef.current.emit('send-message', { message, groupId });
        return true;
    }, [isConnected]);

    const listenForMessages = useCallback((callback: (message: Message, groupId: number) => void) => {

        if (!socketRef.current) {
            console.warn('Cannot listen for messages: Socket not initialized');
            return () => { };
        }

        socketRef.current.off('new-message');

        socketRef.current.on('new-message', (message: Message, groupId: number) => {
            callback(message, groupId);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.off('new-message');
            }
        };
    }, []);

    return {
        isConnected,
        error,
        joinGroup,
        leaveGroup,
        sendMessage,
        listenForMessages,
        socket: socketRef.current
    };
}