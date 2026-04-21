import { Router } from "express";
import {
  getMessagesController,
  sendMessageController,
} from "../controller/chat.controller.js";
import { reqAuth } from "../../user/middleware/reqAuth.middleware.js";

const router = Router();
router.route("/sendMessage").post(reqAuth, sendMessageController);
router.route("/message/:id").get(reqAuth, getMessagesController);

export default router;
