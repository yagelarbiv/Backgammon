import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from './config/db.js';
import 'dotenv/config';
import insertMessage from './messageOperators.js';
import Message from './Message.js'

const app = express();
connectDB();
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

app.get('/fetch-unread-messages', async (req, res) => {
  const { userId } = req.query; // Assume user ID is passed as a query parameter
  try {
    const unreadMessages = await Message.find({ receiverName: userId, readStatus: false }).exec();
    res.json(unreadMessages);
    // Optionally, set messages to read
    await Message.updateMany({ receiverName: userId, readStatus: false }, { $set: { readStatus: true } });
  } catch (error) {
    console.error("Failed to fetch messages", error);
    res.status(500).send("Failed to fetch messages");
  }
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
    
    if (conversation.users && conversation.users.length === 2) {
      const user1 = { userName: conversation.users[1].name };
      const user2 = { name: conversation.users[0].userName };
      conversation.users = [user1, user2];
    }
    
    const otherUserSocketId = userToSocketIdMap[otherUserId];
    if (otherUserSocketId) {
      io.to(otherUserSocketId).emit('conversation_created', conversation);
    }
  });

  socket.on("message", async (msg) => {
    const { senderName, recipientName, text, conversationId } = msg;
  
    try {
      const newMessage = new Message({
        senderName: senderName,
        receiverName: recipientName,
        messageText: text,
        timestamp: new Date(), 
        readStatus: false,
        conversationId: conversationId
      });
  
      const savedMessage = await newMessage.save();
      console.log('Message saved:', savedMessage);
  
      // Emit the message to the sender
      const senderSocketId = userToSocketIdMap[senderName];
      if (senderSocketId) {
        io.to(senderSocketId).emit("message", { senderName, text, conversationId });
      }
  
      // Emit the message to the recipient if different from the sender
      if (recipientName !== senderName) {
        const recipientSocketId = userToSocketIdMap[recipientName];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("message", { senderName, text, conversationId});
        }
      }
    } catch (error) {
      console.error("Error saving message to database:", error);
      // Optionally emit an error message back to the sender
      if (userToSocketIdMap[senderName]) {
        io.to(userToSocketIdMap[senderName]).emit("error", "Failed to save message.");
      }
    }
  });

  socket.on("mark-message-as-read", async (messageId) => {
    try {
      const result = await Message.updateOne(
        { _id: messageId },
        { $set: { readStatus: true } }
      );
      console.log('Message read status updated:', result);
  
      // Optionally notify the sender that the message was read
      // const message = await Message.findById(messageId);
      // if (message && userToSocketIdMap[message.senderName]) {
      //   io.to(userToSocketIdMap[message.senderName]).emit("message-read", messageId);
       //}
    } catch (error) {
      console.error("Error updating message read status:", error);
      socket.emit("error", "Failed to update message read status.");
    }
  });

  // To get my messages from the back to the react app
  app.get('/api/messages', async (req, res) => {
    const { receiverName, readStatus } = req.query;
  
    let query = { receiverName: receiverName };
    if (readStatus !== undefined) {
      query.readStatus = readStatus === 'true'; 
    }
  
    try {
      const messages = await Message.find(query);
      res.json(messages);
    } catch (error) {
      console.error("Failed to fetch messages", error);
      res.status(500).send("Failed to fetch messages");
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