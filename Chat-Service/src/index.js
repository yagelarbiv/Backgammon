import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from './config/db.js';
import 'dotenv/config';
import insertMessage from './messageOperators.js';
import Message from './Message.js'
import Conversation from "./conversation.js";
import internal from "stream";

const app = express();
connectDB();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET","POST", "DELETE"],
  credentials: true
}));
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "DELETE"],
    credentials: true
  },
});

app.get('/fetch-unread-messages', async (req, res) => {
  const { userId } = req.query; 
  try {
    const unreadMessages = await Message.find({ receiverName: userId, readStatus: false }).exec();
    res.json(unreadMessages);
   
    await Message.updateMany({ receiverName: userId, readStatus: false }, { $set: { readStatus: true } });
  } catch (error) {
    console.error("Failed to fetch messages", error);
    res.status(500).send("Failed to fetch messages");
  }
});

const userToSocketIdMap = {};
io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("set_name", (name) => {
    socket.clientName = name;
    userToSocketIdMap[name] = socket.id; 
  });

  socket.on('new_conversation', (data) => {
    const { conversation, otherUserId } = data;
    if (conversation.members && conversation.members.length === 2) {
      const user1 = { userName: conversation.members[1] };
      const user2 = { name: conversation.members[0] };
      conversation.members = [user1, user2];
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
  

      const recipientSocketId = userToSocketIdMap[recipientName];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("message", { senderName, text, conversationId,recipientName });
      }

      const senderSocketId = userToSocketIdMap[senderName];
      if (senderSocketId && senderName !== recipientName) {
        io.to(senderSocketId).emit("message", { senderName, text, conversationId,recipientName, fromSelf: true });
      }
  
    } catch (error) {
      console.error("Error saving message to database:", error);
      // Optionally emit an error message back to the sender
      if (senderSocketId) {
        //io.to(senderSocketId).emit("error", "Failed to save message.");
        return
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
  
   
    } catch (error) {
      console.error("Error updating message read status:", error);
      socket.emit("error", "Failed to update message read status.");
    }
  });

  app.get('/api/messages', async (req, res) => {
    const { receiverName, readStatus } = req.query;
  
    let query = { receiverName: receiverName, readStatus: readStatus };
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


  app.get('/api/messages/:conversationId', async (req, res) => {
    const { conversationId } = req.params;
    const query = { conversationId: conversationId };
  
    try {
      const messages = await Message.find(query); 
      if (messages.length === 0) {
        res.status(404).json({ message: "No messages found for this conversation." });
      } else {
        res.json(messages);
      }
    } catch (error) {
      console.error("Failed to fetch messages", error);
      res.status(500).send("Failed to fetch messages");
    }
  });

  app.delete('/api/delete-chat', async (req, res) => {
    const { conversationId } = req.query;

    try {
        await Message.deleteMany({ conversationId: conversationId });
        await Conversation.deleteOne({ _id: conversationId });

        io.emit('delete-conversation', conversationId);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send("Failed to delete conversation");
    }
  })

  app.get('/api/get-conversations-with-user/:username', async (req, res) => { 
    const { username } = req.params;
    try {
      const messages = await Conversation.find({ members: { $in: [username] } });
      res.json(messages);
    } catch (error) {
      res.status(500).send("Failed to fetch conversations");
    }
  });

  app.post('/api/add-conversation', async (req, res) => {
    const { users } = req.body;
    const receiverSocketId = userToSocketIdMap[users[0]];
    const senderSocketId = userToSocketIdMap[users[1]];
    console.log(users[0], receiverSocketId, users[1], senderSocketId);
     

    try {
      const newConversation = await Conversation.create({ members: users });

      if (!receiverSocketId){
        io.to(senderSocketId).emit('add-conversation', newConversation);
        return res.status(201).json(newConversation);
      }
       if (!receiverSocketId || !senderSocketId) return;

      io.to(receiverSocketId).emit('add-conversation', newConversation);
      io.to(senderSocketId).emit('add-conversation', newConversation);
    
      res.status(201).json(newConversation);  
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).send("Failed to add conversation");
    }
  });
  app.post('/api/add-message-to-conversation', async (req, res) => {
    const { conversationId, message, senderName, receiverName } = req.body; 
    try {
      await Message.create({
        conversationId: conversationId,
        messageText: message,
        senderName: senderName,
        receiverName: receiverName,
        readStatus: false, 
        timestamp: new Date() 
      });
      res.sendStatus(200);
    } catch (error) {
      console.error('Failed to add message:', error);
      res.status(500).send("Failed to add message");
    }
  });


  socket.on("addItems", (data) => {
    console.log("Items received:", data);
    socket.emit("addItem", { item: data, author: socket.id });
  });

  socket.on("disconnect", () => {
    const userName = Object.keys(userToSocketIdMap).find(name => userToSocketIdMap[name] === socket.id);
    if (userName) {
      delete userToSocketIdMap[userName];
    }

  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});