import { friendRequest } from "../model/friendRequest.model.js";
import { Friend } from "../../friend/model/friend.model.js";
import { User } from "../../user/model/user.model.js";
import { Op } from "sequelize";

export const getAllFriendService = async function (userId) {
  if (!userId) {
    throw new Error("User Id is Required");
  }
  const users = await User.findAll({
    where: { id: { [Op.ne]: userId } },
    attributes: ["id", "userName", "email"],
  });
  return {
    statuscode: 202,
    message: "Users Fetched Successfully 🎉",
    data: users,
  };
};

export const createFriendRequestService = async function ({
  senderId,
  receiverId,
}) {
  try {
    if (!senderId || !receiverId) {
      throw new Error("SenderId and ReceiverId are Required !!");
    }

    if (!receiverId) {
      throw new Error("ReceiverId is Required");
    }

    if (senderId == receiverId) {
      throw new Error("You cannot send  Request to Your Self 😕");
    }
    const userA = Math.min(senderId, receiverId);
    const userB = Math.max(senderId, receiverId);

    const checkAlreadyFriends = await Friend.findOne({
      where: { userA, userB },
    });
    if (checkAlreadyFriends) {
      throw new Error("You Both are already Friends 🫂");
    }

    const alreadyGaveRequest = await friendRequest.findOne({
      where: { senderId, receiverId },
    });

    if (alreadyGaveRequest) {
      throw new Error("You already send a request 📩");
    }

    const newRequest = await friendRequest.create({
      senderId,
      receiverId,
      status: "Pending",
    });

    return {
      message: "Request Send Successfully ✔️",
      statuscode: 201,
      data: newRequest,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const friendRequestAcceptService = async function (
  requestId,
  receiverId,
) {
  try {
    if (!requestId || !receiverId) {
      throw new Error("RequestId and ReceiverId are required");
    }

    if (!requestId) {
      throw new Error("RequestId is Required!");
    }

    const request = await friendRequest.findOne({
      where: {
        id: requestId,
        receiverId,
      },
    });

    if (!request) {
      throw new Error("Friend request not found ❌");
    }
    if (request.status !== "pending") {
      throw new Error("Request already handled 🙁");
    }

    request.status = "accepted";
    await request.save();

    const userA = Math.min(request.senderId, request.receiverId);
    const userB = Math.max(request.senderId, request.receiverId);

    const existingFriend = await Friend.findOne({
      where: { userA, userB },
    });

    if (existingFriend) {
      return {
        statuscode: 200,
        message: "Already friends🫂",
      };
    }

    await Friend.create({
      userA,
      userB,
    });

    return {
      statuscode: 200,
      message: "Friend Request Accepted Successfully ✅",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const rejectFriendRequestService = async function (
  requestId,
  receiverId,
) {
  try {
    if (!requestId || !receiverId) {
      throw new Error("RequestId and ReceiverId are required");
    }

    if (!requestId) {
      throw new Error("RequestId is Required!");
    }
    const request = await friendRequest.findOne({
      where: {
        id: requestId,
        receiverId,
      },
    });
    if (!request) {
      throw new Error("Friend Request Not found 😕");
    }
    if (request.status !== "pending") {
      throw new Error("Request already handled 🙁");
    }
    request.status = "rejected";
    await request.save();

    return {
      statuscode: 200,
      message: "Your Friend Request is Rejected 🥺",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
