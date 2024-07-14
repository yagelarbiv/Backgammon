import express from "express";
import Conversation from "../models/conversation.js";
import Message from "../models/Message.js";
import { userToSocketIdMap,io } from "../utils/socketManager.js";


export const getConversationsWithUser = async (req, res) => { 
    const { username } = req.params;
    try {
      const messages = await Conversation.find({ members: { $in: [username] } });
      res.json(messages);
    } catch (error) {
      res.status(500).send("Failed to fetch conversations");
    }
}


export const addConversation = async (req, res) => {
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
}

export const deleteConversation = async (req, res) => {
    const { conversationId } = req.query;

    try {
        await Message.deleteMany({ conversationId: conversationId });
        await Conversation.deleteOne({ _id: conversationId });

        io.emit('delete-conversation', conversationId);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send("Failed to delete conversation");
    }
}