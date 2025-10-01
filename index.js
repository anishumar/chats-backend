import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import "./config/mongo.js";

import { VerifyToken, VerifySocketToken } from "./middlewares/VerifyToken.js";
import chatRoomRoutes from "./routes/chatRoom.js";
import chatMessageRoutes from "./routes/chatMessage.js";
import userRoutes from "./routes/user.js";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(VerifyToken);

const PORT = Number(process.env.PORT) || 8080;

app.use("/api/room", chatRoomRoutes);
app.use("/api/message", chatMessageRoutes);
app.use("/api/user", userRoutes);

function bindSockets(serverInstance) {
  const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:5173")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const io = new Server(serverInstance, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use(VerifySocketToken);

  io.on("connection", (socket) => {
    global.chatSocket = socket;

    socket.on("addUser", (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.emit("getUsers", Array.from(onlineUsers));
    });

    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
      const sendUserSocket = onlineUsers.get(receiverId);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("getMessage", {
          senderId,
          message,
        });
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(getKey(onlineUsers, socket.id));
      socket.emit("getUsers", Array.from(onlineUsers));
    });
  });
}

function startServer(preferredPort, attempt = 0) {
  const server = app
    .listen(preferredPort, () => {
      console.log(`Server listening on port ${preferredPort}`);
      bindSockets(server);
    })
    .on("error", (err) => {
      if (err && err.code === "EADDRINUSE" && attempt < 10) {
        const nextPort = preferredPort + 1;
        console.warn(
          `Port ${preferredPort} in use, retrying on ${nextPort} (attempt ${attempt + 1})`
        );
        startServer(nextPort, attempt + 1);
      } else {
        throw err;
      }
    });
}

startServer(PORT);

global.onlineUsers = new Map();

const getKey = (map, val) => {
  for (let [key, value] of map.entries()) {
    if (value === val) return key;
  }
};

// Socket handlers are registered in bindSockets() after HTTP server starts
