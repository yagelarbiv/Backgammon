import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";
import { log } from "console";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5000",
  methods: ["GET", "POST"],
  credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5000", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
  },
});
const getUserNameFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_JWT);
    return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
  } catch (error) {
    console.error("Failed to decode or verify JWT:", error);
    return null;
  }
};

// Middleware to authenticate and set the user's name
io.use((socket, next) => {
  console.log("Handshake details:", socket.handshake.query);
  const token = socket.handshake.query.token;
  console.log("Received token: " + token);
  if (!token) {
    return next(new Error('Authentication error: Token required'));
  }

  console.log("token: " + token);

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_JWT);
    const username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    if (!username) {
      return next(new Error('Authentication error: Invalid token'));
    }
    socket.clientName = username; // Store username directly in socket session
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    next(new Error('Authentication error: Failed to decode or verify JWT'));
  }
});

io.on("connection", (socket) => {
  console.log("New user connected:", socket.clientName);

  socket.emit("message", `${socket.clientName} Connected`);

  socket.on("message", (msg) => {
    console.log("Message received:", msg);
    io.emit("message-broadcast", { msg, author: socket.clientName });
  });

  socket.on("addItems", (data) => {
    console.log("Items added:", data);
    socket.emit("addItem", { item: data, author: socket.clientName });
  });

  socket.on("manual_disconnect", () => {
    console.log(`${socket.clientName} manually disconnected.`);
    socket.broadcast.emit("message-broadcast", `${socket.clientName} manually disconnected.`);
    socket.disconnect();
  });

  socket.on("disconnect", () => {
    console.log(`${socket.clientName} has disconnected.`);
    socket.broadcast.emit("message-broadcast", `${socket.clientName} has disconnected.`);
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});