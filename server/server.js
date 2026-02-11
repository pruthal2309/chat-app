import  express from 'express';
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
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected: ", userId);

    if(userId) userSocketMap[userId] = socket.id;
    console.log("User SocketId: ", socket.id);

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User Disconnected: ", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
})


// Middleware
app.use(express.json({limit: "4mb"}));
app.use(cors());

app.use("/api/status", (req, res) => res.send("API is working"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);


// Connect to MongoDB
await connectDB();


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {console.log(`Server is running on port ${PORT}`); }); 