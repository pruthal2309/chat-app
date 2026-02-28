import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRouters.js';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

// Initalize Socket.io server
export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Store online users
export const userSocketMap = {};

// Socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    const userIdStr = String(userId); // normalize to string
    console.log("User Connected: ", userIdStr);

    if (userId) userSocketMap[userIdStr] = socket.id;
    console.log("User SocketId: ", socket.id, "Map:", userSocketMap);

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User Disconnected: ", userIdStr);
        delete userSocketMap[userIdStr];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    socket.on("typing", ({ receiverId }) => {
        const rid = String(receiverId);
        const receiverSocketId = userSocketMap[rid];
        console.log(`typing: sender=${userIdStr} receiver=${rid} socket=${receiverSocketId}`);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing", { senderId: userIdStr });
        }
    });

    socket.on("stopTyping", ({ receiverId }) => {
        const rid = String(receiverId);
        const receiverSocketId = userSocketMap[rid];
        console.log(`stopTyping: sender=${userIdStr} receiver=${rid}`);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("stopTyping", { senderId: userIdStr });
        }
    });

})


// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => res.send("API is working"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Serve static files from the client dist directory
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure we point to the correct dist folder. 
// Assuming server.js is in /server and dist is in /client/dist
const clientDistPath = path.join(__dirname, '../client/dist');

app.use(express.static(clientDistPath));

// Handle React routing, return all requests to React app
// Handle React routing, return all requests to React app
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
});


// Connect to MongoDB
await connectDB();


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); }); 