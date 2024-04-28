import { io } from "socket.io-client";
import "react-dotenv";

export const onlineUsersSocket = io(import.meta.env.VITE_APP_ONLINE_URL);
