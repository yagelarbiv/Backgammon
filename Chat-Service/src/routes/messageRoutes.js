import express from "express";
import * as messageService from "../services/messageService.js";

const router = express.Router();


router.get('/fetch-unread-messages', messageService.fetchUnreadMessages);
router.get('/messages', messageService.getMessages);
router.get('/messages/:conversationId', messageService.getMessagesByConversation);
router.post('/add-message-to-conversation', messageService.addMessageToConversation);



export default router;