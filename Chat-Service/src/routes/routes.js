import express from "express";
import conversationRoutes from "./conversationRoutes.js";
import messageRoutes from "./messageRoutes.js";


const router = express.Router();

router.use("/api", conversationRoutes);
router.use("/api", messageRoutes);

export default router;