
import Message from "../models/Message.js";



export const fetchUnreadMessages = async (req, res) => {
    const { userId } = req.query; 
    try {
      const unreadMessages = await Message.find({ receiverName: userId, readStatus: false }).exec();
      res.json(unreadMessages);
     
      await Message.updateMany({ receiverName: userId, readStatus: false }, { $set: { readStatus: true } });
    } catch (error) {
      console.error("Failed to fetch messages", error);
      res.status(500).send("Failed to fetch messages");
    }
}

export const getMessages = async (req, res) => {
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
}

export const getMessagesByConversation = async (req, res) => {
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
}




export const addMessageToConversation = async (req, res) => {
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
}
