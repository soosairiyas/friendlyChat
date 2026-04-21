import { app } from "./app.js";
import { sendMessageService } from "./src/chats/service/chat.service.js";
import { dbConnect } from "./src/config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const PORT = process.env.PORT || 4000;
console.log(">>>>>PORT", PORT);

//create HTTP server

dbConnect();
const server = createServer(app);

// Attached Socket
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});
io.use((socket, next) => {
  try {
    console.log(">>>>>>>>>>>>>>>", socket.handshake);
    const cookies = socket.handshake.headers.cookie;
    console.log(">>>>>>>>>>>>>>>", cookies);
    const parsed = cookie.parse(cookies);

    const token = parsed.userjwtToken;

    console.log("✅ Token:", token);

    if (!token) {
      return next(new Error("No token provided"));
    }

    const decoded = jwt.verify(token, process.env.CHAT_USER_JWT_SECRET);

    socket.userId = decoded.id;

    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});

// ✅ CONNECTION HANDLER
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id, "UserId:", socket.userId);
  socket.on("joinRoom", (chatId) => {
    const roomName = `user_${chatId}`;
    console.log("Socket ID:", socket.id);
    console.log("User ID:", socket.userId);
    console.log("Joined room:", roomName);
    socket.join(roomName);
    console.log("Rooms of socket:", socket.rooms);
  });

  // sending Message to the User
  socket.on("sendMessage", async ({ receiverId, message, chatId }) => {
    try {
      const senderId = socket.userId;

      const savedMessage = await sendMessageService({
        senderId,
        receiverId,
        message,
      });
      io.to(`user_${chatId}`).emit("receiveMessage", savedMessage);
      console.log("chatId", chatId);
      socket.emit("receiveMessage", savedMessage);
    } catch (error) {
      socket.emit("errorMessage", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
