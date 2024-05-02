import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderName: { type: String, required: true },
  receiverName: { type: String, required: true },
  messageText: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  readStatus: { type: Boolean, default: false },
  conversationId: { type: String, required: true }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
