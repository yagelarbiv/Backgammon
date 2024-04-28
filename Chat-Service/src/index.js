import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET","POST"],
  credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
});
const userToSocketIdMap = {};
io.on("connection", (socket) => {
  console.log("New user connected");

  // Handle client setting their name
  socket.on("set_name", (name) => {
    socket.clientName = name;
    userToSocketIdMap[name] = socket.id; // Corrected variable name here
    socket.emit(
      "message",
      `${socket.clientName} Connected`
    );
  });

socket.on('new_conversation', (data) => {
  const { conversation, otherUserId } = data;
  const otherUserSocketId = userToSocketIdMap[otherUserId];

  if (otherUserSocketId) {
    io.to(otherUserSocketId).emit('conversation_created', conversation);
  }
});

socket.on("message", (msg) => {
  const { senderName, recipientName, text, conversationId } = msg;

  // Emit the message to the sender
  const senderSocketId = userToSocketIdMap[senderName];
  if (senderSocketId) {
    io.to(senderSocketId).emit("message", { senderName, text, conversationId });
  }

  // Emit the message to the recipient if the recipient is different from the sender
  if (recipientName !== senderName) {
    const recipientSocketId = userToSocketIdMap[recipientName];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("message", { senderName, text, conversationId });
    }
  }
});


  // Handle addition of items
  socket.on("addItems", (data) => {
    console.log("Items received:", data);
    socket.emit("addItem", { item: data, author: socket.id });
  });

  // Handle manual disconnection
  socket.on("manual_disconnect", () => {
    if (socket.clientName) {
      socket.broadcast.emit(
        "message-broadcast",
        `${socket.clientName} manually disconnected.`
      );
    }
    socket.disconnect();
  });

  // Handle automatic disconnection

  socket.on("disconnect", () => {
    // Remove the mapping when the user disconnects
    const userName = Object.keys(userToSocketIdMap).find(name => userToSocketIdMap[name] === socket.id);
    if (userName) {
      delete userToSocketIdMap[userName];
    }
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});