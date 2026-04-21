import { Chats } from "../model/chat.model.js";
import { Op } from "sequelize";
import { friendRequest } from "../../friendRequestTable/model/friendRequest.model.js";
import { Friend } from "../../friend/model/friend.model.js";

// Check Friendship between two users
const isUserFriend = async (userId, otherUserId) => {
  const request = await friendRequest.findOne({
    where: {
      status: "accepted",
      [Op.or]: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    },
  });

  if (!request) return false;

  const friend = await Friend.findOne({
    where: {
      requestId: request.id,
      state: "active",
    },
  });
  return !!friend;
};

export const sendMessageService = async function ({
  senderId,
  receiverId,
  message,
}) {
  if (!senderId || !receiverId || !message) {
    throw new Error("All fields are Required!");
  }

  const isFriend = await isUserFriend(senderId, receiverId);

  if (!isFriend) {
    throw new Error("You can only message to you friends ❌");
  }

  const chat = await Chats.create({
    senderId,
    receiverId,
    message,
  });
  return chat;
};

export const getMessagesService = async (userId, otherUserId) => {
  console.log("userId:", userId);
  console.log("otherUserId", otherUserId);
  return await Chats.findAll({
    where: {
      [Op.or]: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    },
    order: [["createdAt", "ASC"]],
  });
};
