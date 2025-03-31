import { Server } from 'socket.io';

// approche du singleton
let ioInstance;

export default function handler(req, res) {
    if (res.socket.server.io) {
        res.end();
        return;
    }

    const io = new Server(res.socket.server, {
        path: '/api/socketio',
        cors: {
            origin: process.env.NODE_ENV === 'production'
                ? false
                : ['http://localhost:3000'],
            methods: ['GET', 'POST'],
            credentials: true,
        },
        addTrailingSlash: false
    });

    res.socket.server.io = io;
    ioInstance = io;

    io.on('connection', (socket) => {

        socket.groups = new Set();

        socket.on('identify', (user) => {
            socket.data.user = user;
        });

        socket.on('join-group', (groupId) => {
            const roomName = `group:${groupId}`;
            socket.join(roomName);
            socket.groups.add(groupId);
        });

        socket.on('leave-group', (groupId) => {
            const roomName = `group:${groupId}`;
            socket.leave(roomName);
            socket.groups.delete(groupId);
        });

        socket.on('disconnect', () => {

        });

        socket.on('send-message', ({ message, groupId }) => {
            const roomName = `group:${groupId}`;
            io.to(roomName).emit('new-message', message, groupId);
        });
    });

    res.end();
}

// export de l'instance de socket.io
export function getIO() {
    return ioInstance;
}