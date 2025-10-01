import express from "express";
import {
  createChatRoom,
  getChatRoomOfUser,
  getChatRoomOfUsers,
} from "../../controllers/chatRoom.js";

const router = express.Router();

// create chat room
router.post("/chat-rooms", createChatRoom);

// chat rooms for a user
router.get("/users/:userId/chat-rooms", getChatRoomOfUser);

// chat room by member pair
router.get("/chat-rooms/by-members/:firstUserId/:secondUserId", getChatRoomOfUsers);

export default router;
