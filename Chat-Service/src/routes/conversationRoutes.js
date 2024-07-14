import express from "express";
import * as conversationService from "../services/conversationService.js";

const router = express.Router();


router.get('/get-conversations-with-user/:username', conversationService.getConversationsWithUser);
router.post('/add-conversation', conversationService.addConversation);
router.delete('/delete-chat', conversationService.deleteConversation);



export default router



