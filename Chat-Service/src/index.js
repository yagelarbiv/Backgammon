import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

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

io.on("connection", (socket) => {
  console.log("New user connected");

  // Handle client setting their name
  socket.on("set_name", (name) => {
    socket.clientName = name;
    socket.emit(
      "message",
      socket.clientName
        ? `${socket.clientName}: ${name} Connected`
        : "Hello From server!"
    );
  });

  // Handle message sending
  socket.on("message", (msg) => {
    console.log("message received:", msg);
    io.emit("message-broadcast", msg);
  });

//   socket.on("message", (message) => {
//     console.log("message received:", message);
//     // You'll need to find the recipient's socket and emit the message to that socket.
//     // This is a simplified example. You'll need to maintain a map of user IDs to socket IDs.
//     const recipientSocket = findRecipientSocket(message.recipientId);
//     recipientSocket.emit("message", message);
// });

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
    if (socket.clientName) {
      socket.broadcast.emit(
        "message-broadcast",
        `${socket.clientName} has disconnected.`
      );
    }
    console.log("User disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
