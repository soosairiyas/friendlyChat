import { Router } from "express";
import {
  createFriendRequestController,
  friendRequestAcceptController,
  friendRequestRejectController,
  getAllFriendController,
} from "../controller/friendRequest.controller.js";

import { reqAuth } from "../../user/middleware/reqAuth.middleware.js";

export const router = Router();
router.route("/getallfriends").get(reqAuth, getAllFriendController);
router.route("/createrequest").post(reqAuth, createFriendRequestController);
router.route("/acceptrequest").post(reqAuth, friendRequestAcceptController);
router.route("/rejectrequest").post(reqAuth, friendRequestRejectController);

export default router;
