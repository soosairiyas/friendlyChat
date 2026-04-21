import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "../chatBackend/src/user/routes/user.routes.js";
import requestRouter from "../chatBackend/src/friendRequestTable/Routes/friendRequest.routes.js";
import chatMessages from "../chatBackend/src/chats/routes/chat.routes.js";

export const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
// ALL API ROUTES
app.use("/api/user", userRouter);
app.use("/api/request", requestRouter);
app.use("/api/chats", chatMessages);
