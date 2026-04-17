import { Router } from "express";
import {
  createFriendRequestController,
  friendRequestAcceptController,
  friendRequestRejectController,
  getAllFriendController,
  getFriendRequestController,
  getFriendsController,
  removeFriendController,
} from "../controller/friendRequest.controller.js";

import { reqAuth } from "../../user/middleware/reqAuth.middleware.js";

export const router = Router();
router.route("/getallfriends").get(reqAuth, getAllFriendController);
router.route("/getrequests").get(reqAuth, getFriendRequestController);
router.route("/friends").get(reqAuth, getFriendsController);
router.route("/createrequest/:id").post(reqAuth, createFriendRequestController);
router.route("/acceptrequest/:id").post(reqAuth, friendRequestAcceptController);
router.route("/rejectrequest/:id").post(reqAuth, friendRequestRejectController);
router.route("/removefriend/:id").delete(reqAuth, removeFriendController);

export default router;
