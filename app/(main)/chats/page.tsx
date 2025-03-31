"use client"

import * as React from "react"
import { useEffect, useState, useRef } from "react"
import { ChatInterface } from "@/components/chat-interface"
import { cn } from "@/lib/utils"
import { useSocket } from "@/hooks/useSocket"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { useUserSession } from "@/lib/useUserSession";

interface Group {
    id: number
    name: string
    members: number
    documents: number
    isJoined: boolean
    lastMessage?: string
}

export interface Message {
    id: string
    content: string
    sender: {
        id: number
        username: string
    }
    timestamp: Date
}

export default function ChatPage() {
    const { user, loading } = useUserSession();
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
    const [groups, setGroups] = useState<Group[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [currentUserId, setCurrentUserId] = useState<number | null>(null)
    const shouldProcessSocketMessages = useRef<boolean>(true)
    const previousGroupIdRef = useRef<number | null>(null)

    // on intègre le socket ici
    const { isConnected, error, joinGroup, leaveGroup, sendMessage, listenForMessages } = useSocket()

    // on récupère la session utilisateur
    useEffect(() => {
        async function fetchSession() {
            try {
                const response = await fetch("/api/sessionUser");
                if (!response.ok) throw new Error("Failed to fetch session");
                const data = await response.json();

                if (data.id) {
                    setCurrentUserId(data.id);
                }
            } catch (error) {
                console.error("Failed to get user session:", error);
            }
        }

        fetchSession();
    }, []);

    // filtrage les groupes en fonction de la recherche
    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // on récupère les groupes
    useEffect(() => {
        async function fetchGroups() {
            try {
                const response = await fetch("/api/groups");
                if (!response.ok) throw new Error("Error fetching groups");

                const data = await response.json();
                setGroups(data);

                // Si aucun groupe n'est sélectionné, on sélectionne le premier groupe
                if (data.length > 0 && !selectedGroupId) {
                    setSelectedGroupId(data[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch groups:", error);
                toast.error("Impossible de charger les groupes");
            }
        }

        fetchGroups();
    }, [selectedGroupId]);

    // Écoute des messages entrants via Socket.IO
    useEffect(() => {
        const handleNewMessage = ({ message, groupId }: { message: Message, groupId: number }) => {
            if (selectedGroupId && groupId === selectedGroupId) {
                if (message.sender.id === currentUserId) {
                    return;
                }
                setMessages(prevMessages => {
                    if (prevMessages.some(msg => msg.id === message.id)) {
                        return prevMessages;
                    }
                    const updatedMessages = [...prevMessages, message];

                    setTimeout(() => {
                        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                    }, 50);

                    return updatedMessages;
                });
            } else {
                if (message.sender.id !== currentUserId) {
                    const groupName = groups.find(g => g.id === groupId)?.name || "Autre groupe";
                    toast(`Nouveau message dans ${groupName}`, {
                        description: `${message.sender.username}: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`,
                        action: {
                            label: "Voir",
                            onClick: () => setSelectedGroupId(groupId)
                        }
                    });
                }
            }
        };

        const cleanup = listenForMessages((message, groupId) => {
            handleNewMessage({ message, groupId });
        });

        return cleanup;
    }, [listenForMessages, selectedGroupId, currentUserId, groups]);

    // recupération des messages du groupe sélectionné
    useEffect(() => {
        if (selectedGroupId) {
            shouldProcessSocketMessages.current = false;

            async function fetchMessages() {
                try {
                    const response = await fetch(`/api/messages/${selectedGroupId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setMessages(data);
                        shouldProcessSocketMessages.current = true;

                        setTimeout(() => {
                            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                    } else {
                        throw new Error("Failed to fetch messages");
                    }
                } catch (error) {
                    console.error("Failed to fetch messages:", error);
                    toast.error("Could not load messages");
                    shouldProcessSocketMessages.current = true;
                }
            }

            fetchMessages();

            // on rejoint le groupe via Socket.IO
            if (isConnected) {
                joinGroup(selectedGroupId);
            }

            // on quitte le groupe quand on change de groupe
            return () => {
                if (isConnected && selectedGroupId) {
                    leaveGroup(selectedGroupId);
                }
            };
        }
    }, [selectedGroupId, joinGroup, leaveGroup, isConnected]);

    // Vérification de la connexion Socket.IO
    useEffect(() => {
        if (error) {
            toast.error("Impossible de se connecter au serveur de chat");
        }
    }, [error]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Gestion de l'envoi de messages
    const handleSendMessage = async (content: string) => {
        if (!content.trim() || !selectedGroupId) return;

        try {
            // recuperation des données de l'utilisateur

            const message: Message = {
                id: Date.now().toString(), // id temporaire
                content,
                sender: {
                    id: currentUserId || 0,
                    username: user?.username || "Vous"
                },
                timestamp: new Date(),
            };
            const socketSuccess = sendMessage(message, selectedGroupId);

            if (!socketSuccess) {
                toast.warning("Mode hors-ligne, tentative d'envoi via HTTP...");
            }

            const response = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ groupId: selectedGroupId, content })
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            const newMessage = await response.json();

            setMessages(prev => {
                if (!prev.some(msg => msg.id === newMessage.id)) {
                    setTimeout(() => {
                        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                    }, 50);

                    return [...prev, newMessage];
                }
                return prev;
            });

        } catch (error) {
            console.error("Failed to send message:", error);
            toast.error("Impossible d'envoyer le message");
        }
    };

    const isMobile = useIsMobile();
    const selectedGroup = groups.find(group => group.id === selectedGroupId);

    return (
        <div className="flex h-screen w-full">
            {(!isMobile || !selectedGroupId) && (
                <div className={`${isMobile ? "w-full" : "w-80"} border-r flex flex-col h-full`}>
                    <div className="p-3 border-b">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Rechercher un groupe"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <ScrollArea className="flex-1">
                        {filteredGroups.length > 0 ? (
                            filteredGroups.map((group) => (
                                <div
                                    key={group.id}
                                    className={cn(
                                        "flex items-center p-3 cursor-pointer hover:bg-muted/50",
                                        selectedGroupId === group.id && "bg-muted"
                                    )}
                                    onClick={() => setSelectedGroupId(group.id)}
                                >
                                    <Avatar className="h-10 w-10 mr-3">
                                        <AvatarFallback>{group.name.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{group.name}</div>
                                        <div className="text-xs text-muted-foreground truncate">
                                            {group.members} membres • {group.documents} documents
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-muted-foreground">
                                Aucun groupe trouvé
                            </div>
                        )}
                    </ScrollArea>
                </div>
            )}
            {/* Affichage de l'interface de chat */}
            {(!isMobile || selectedGroupId) && (
                <div className="flex-1 h-full">
                    {selectedGroup ? (
                        <ChatInterface
                            group={selectedGroup}
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            onBack={isMobile ? () => setSelectedGroupId(null) : undefined}
                            userId={currentUserId || 0}
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <h3 className="text-lg font-medium">Sélectionnez un groupe pour commencer la conversation</h3>
                                <p className="text-muted-foreground mt-2">
                                    Ou créez un nouveau groupe depuis la page Groupes
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
}

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);

        return () => {
            window.removeEventListener("resize", checkIsMobile);
        };
    }, []);

    return isMobile;
}
