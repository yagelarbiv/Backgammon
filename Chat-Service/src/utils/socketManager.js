import { Server } from "socket.io";
import { corsConfigurations } from "../config/config.js";

let io;
const userToSocketIdMap = {};

export const initializeSocketIO = (server) => {
    io = new Server(server, {
        cors: corsConfigurations,
    });
    return io;
}

export { io, userToSocketIdMap }