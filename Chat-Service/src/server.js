import http from "http";
import app from './app.js';
import connectDB from './config/db.js';
import { initializeSocketIO } from './utils/socketManager.js';
import { handleConnection } from './socketHandlers/socketHandlers.js';

connectDB();

const server = http.createServer(app);
const io = initializeSocketIO(server);

io.on("connection", handleConnection);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});