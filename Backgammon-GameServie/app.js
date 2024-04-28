import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
import fs from "fs";
import gameRoutes from "./routes/game.routes.js";
import {
  usernameToSocketIdMap
} from "./controllers/game.controller.js";

import dotenv from "dotenv";
import { log } from "console";
dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
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

const sockets = [];
const socketServer = http.createServer(app);
export const io = new Server(socketServer, {
  cors: {
    origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
  },
});

export function socketEmit(eventName, data, to) {
  console.log("Emitting: " + eventName);
  io.to(to).emit(eventName, data);
}

io.on('game-start', (from, to) => {
  log(from, to);
  try {
      if (!to || !from) {
        return res.status(400).json({ error: "Missing username" });
      }
      if (!exists) {
        return res.status(404).json({ error: "User not found" });
      }
      io.to(to).emit("game-invite", from);
      return res.status(200).json({ message: "User found" });
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  io.on("invite-declined", (from, to) => {
    io.to(allUsers[from]).emit("decline-invite", to);
  });
  
  io.on("invite-accepted", (from, to) => {
    io.to(allUsers[from]).emit("accept-invite", to);
  });

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("game-win", (data) => {
    socket.emit("on-game-won", data);
  });
  socket.on("disconnect", () => {
    const leavingUser = Object.keys(usernameToSocketIdMap).find(
      (username) => usernameToSocketIdMap[username] === socket.id
    );
    io.emit("user-disconnected", leavingUser);
  });
});

io.on("disconnect", () => {
  console.log("disconnected io");
});

socketServer.listen(process.env.GAME_PORT || 3003,() => {
  console.log('Server is running on port 5700');
});