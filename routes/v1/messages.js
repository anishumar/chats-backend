import express from "express";
import { createMessage, getMessages } from "../../controllers/chatMessage.js";

const router = express.Router();

// create message
router.post("/messages", createMessage);

// messages in a chat room
router.get("/chat-rooms/:chatRoomId/messages", getMessages);

export default router;
