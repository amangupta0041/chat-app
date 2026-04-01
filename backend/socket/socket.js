import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        // FIXED for production: Allow dynamic origins
        origin: true,
        methods: ['GET', 'POST'],
    },
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

const userSocketMap = {}; // {userId: socketId}

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    
    // FIXED: Ensure we only map valid userIds
    if (userId && userId !== "undefined") {
        // FIXED: Changed '-' to '=' to actually save the socket ID
        userSocketMap[userId] = socket.id;
    }

    // This sends the list of online user IDs to all connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export { app, io, server };