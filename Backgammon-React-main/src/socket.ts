import { io } from "socket.io-client";

export const socket = io("http://localhost:3003", {
  transports: ["websocket"],
  withCredentials: true,
});
