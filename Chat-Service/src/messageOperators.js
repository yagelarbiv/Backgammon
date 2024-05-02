import mongoose from 'mongoose';
import Message from './Message.js';  // Adjust path as necessary

// Assuming you've already called connectDB somewhere in your app initialization
const insertMessage = async (senderName, receiverName, messageText) => {
  try {
    const newMessage = new Message({
      senderName,
      receiverName,
      messageText
    });

    const savedMessage = await newMessage.save();
    console.log('Message inserted:', savedMessage);
    return savedMessage;  // Return the saved message document
  } catch (err) {
    console.error("Failed to insert message", err);
    throw err;  // Throw the error to be handled by the caller
  }
};

export default insertMessage;