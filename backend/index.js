import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import userRoute from './routes/userRoute.js';
import messageRoute from "./routes/messageRoute.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
// FIXED: You already import app and server from socket.js, so you don't need 'import express' again here.
import { app, server } from "./socket/socket.js"; 

const __dirname = path.resolve();

dotenv.config({});

const PORT = process.env.PORT || 5000;

// 1. MIDDLEWARE (Must come BEFORE routes)
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:3000',
    process.env.CLIENT_URL
].filter(Boolean);

const corsOption = {
    origin: allowedOrigins,
    credentials: true
};
app.use(cors(corsOption));

// 2. ROUTES
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

// 3. STATIC FILES (Serving Frontend)
app.use(express.static(path.join(__dirname, "../frontend/build")));

// render frontend for any path that does not match an api route
app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
});

// 4. SERVER INITIALIZATION
// Using server.listen (from http.createServer) is the ONLY way to fix the 404 socket errors
server.listen(PORT, () => {
    connectDB();
    console.log(`Server listening at port ${PORT}`);
});