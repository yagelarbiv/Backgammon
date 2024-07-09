import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
import fs from "fs";
import gameRoutes from "./routes/game.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/game", gameRoutes);

app.use((req, res, next) => {
  const error = new Error("Could not find this route.");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  console.error(error.stack);
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.status || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const socketServer = http.createServer(app);
export const io = new Server(socketServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174"
    ],
  methods: ["GET", "POST"],
  credentials: true
  },
});

export function socketEmit(eventName, data, to) {
  console.log("Emitting: " + eventName);
  io.to(to).emit(eventName, data);
}

const userToSocketIdMap = {};

io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("set_name", (name) => {
    console.log('name: ',name);
    userToSocketIdMap[name] = socket.id;
    socket.emit("welcome", `${name}, you are connected for gaming.`);
  });
  socket.on('new_game', (User, otherUser) => {
    const otherUserSocketId = userToSocketIdMap[User];
  
    if (otherUserSocketId) {
      console.log(`Game created ${otherUserSocketId}`);
      io.to(otherUserSocketId).emit('game_created', otherUser);
    }
  });
  socket.on("game-start", (from, to) => {
    console.log('list: ',userToSocketIdMap);
    console.log('users: ', from, to);
    if (!to || !from) {
      socket.emit('error', { error: "Missing username" });
      return;
    }
    const toSocketId = userToSocketIdMap[to];
    console.log('socketId', toSocketId);
    if (toSocketId) {
      console.log(`Game invite sent from ${from} to ${to}`);
      io.to(toSocketId).emit("game-invite", from);
    } else {
        socket.emit('error', { error: "User not found" });
    }
  });
  socket.on("disconnect", () => {
    const userName = Object.keys(userToSocketIdMap).find(name => userToSocketIdMap[name] === socket.id);
    if (userName) {
      delete userToSocketIdMap[userName];
      console.log(`${userName} disconnected and removed from user map.`);
    }
  });
});

socketServer.listen(3003, () => {
  console.log("Server is running on port 3003 for game invites");
});
