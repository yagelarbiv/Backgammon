import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderName: { type: String, required: true },
  receiverName: { type: String, required: true },
  messageText: { type: String, required: true },
  readStatus: { type: Boolean, default: false },
  conversationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Conversation', 
    required: true 
  },
},{ timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;
