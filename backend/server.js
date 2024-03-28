import express from "express";
import { Server } from "socket.io";
const app = express();
import cors from "cors";
import { createServer } from "http";
const server =  createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
})

const port = 3000;
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
}))
app.get("/", (req, res) => {
    res.send("Hello World");
});


io.on("connection", (socket) => {
    console.log("A User connected : ", socket.id);

    socket.on("message", ({room, message, socketID}) => {
        io.to(room).emit("received-message", {message, socketID});
    });    
    socket.on("join-room", ({room, socketID}) => {
        socket.join(room);
        console.log(`${socketID} joined room ${room}`);
    });
    socket.on("disconnect", () => {
        console.log(`${socket.id} User disconnected`);
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});