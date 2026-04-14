import { friendRequest } from "../model/friendRequest.model.js";
import { Friend } from "../../friend/model/friend.model.js";

export const CreateFriendRequestService = async function ({
  senderId,
  receiverId,
}) {
  try {
    if (!senderId || !receiverId) {
      throw new Error("SenderId and ReceiverId are Required !!");
    }

    if (senderId == receiverId) {
      throw new Error("You cannot send Send Request to Your Self 😕");
    }

    const checkAlreadyFriends = await Friend.findOne({
      where: { userId: senderId, friendId: receiverId },
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
      statusCode: 201,
      data: newRequest,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
