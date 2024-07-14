import Message from '../models/Message.js';
import { io, userToSocketIdMap } from '../utils/socketManager.js';

export const handleConnection = (socket) => {
  console.log("New user connected");

  socket.on("set_name", (name) => {
    socket.clientName = name;
    userToSocketIdMap[name] = socket.id; 
  });

  socket.on('new_conversation', handleNewConversation);
  socket.on("message", handleMessage);
  socket.on("mark-message-as-read", handleMarkMessageAsRead);
  socket.on("addItems", handleAddItems);
  socket.on("disconnect", handleDisconnect);
};

const handleNewConversation = (data) => {
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
};

const handleMessage = async (msg) => {
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
      io.to(recipientSocketId).emit("message", { senderName, text, conversationId, recipientName });
    }

    const senderSocketId = userToSocketIdMap[senderName];
    if (senderSocketId && senderName !== recipientName) {
      io.to(senderSocketId).emit("message", { senderName, text, conversationId, recipientName, fromSelf: true });
    }

  } catch (error) {
    console.error("Error saving message to database:", error);
  }
};

const handleMarkMessageAsRead = async (messageId) => {
  try {
    const result = await Message.updateOne(
      { _id: messageId },
      { $set: { readStatus: true } }
    );
    console.log('Message read status updated:', result);
  } catch (error) {
    console.error("Error updating message read status:", error);
  }
};

const handleAddItems = (data) => {
  console.log("Items received:", data);
  io.to(socket.id).emit("addItem", { item: data, author: socket.id });
};

const handleDisconnect = () => {
  const userName = Object.keys(userToSocketIdMap).find(name => userToSocketIdMap[name] === socket.id);
  if (userName) {
    delete userToSocketIdMap[userName];
  }
};