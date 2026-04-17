import { friendRequest } from "../model/friendRequest.model.js";
import { Friend } from "../../friend/model/friend.model.js";
import { User } from "../../user/model/user.model.js";
import { Op, where } from "sequelize";

friendRequest.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender",
});

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

    if (senderId == receiverId) {
      throw new Error("You cannot send  Request to Your Self 😕");
    }

    const receiver = await User.findByPk(receiverId);
    if (!receiver) {
      throw new Error(`Receiver Not found ❌`);
    }
    const alreadyGaveRequest = await friendRequest.findOne({
      where: {
        [Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (alreadyGaveRequest) {
      if (alreadyGaveRequest.status === "accepted") {
        const existingFriend = await Friend.findOne({
          where: {
            requestId: alreadyGaveRequest.id,
            state: "active",
          },
        });

        if (existingFriend) {
          throw new Error("You both are already friends 🫂");
        }
      }

      throw new Error("Request already exists 📩");
    }

    const newRequest = await friendRequest.create({
      senderId,
      receiverId,
      status: "pending",
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

export const getFriendRequestService = async function (userId) {
  if (!userId) {
    throw new Error("userId is Required !");
  }
  const requests = await friendRequest.findAll({
    where: {
      receiverId: userId,
      status: "pending",
    },
    attributes: ["id"],
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "userName"],
      },
    ],
  });
  const data = requests.map((r) => ({
    requestId: r.id,
    sender: r.sender,
  }));

  if (data.length === 0) {
    return {
      statuscode: 200,
      message: "You don't have any friend Requests to accept 🧑‍🤝‍🧑",
    };
  }

  return {
    statuscode: 200,
    message: "Friend Requests Fetched Successfully ✅",
    data,
  };
};

export const friendRequestAcceptService = async function (
  requestId,
  receiverId,
) {
  try {
    if (!requestId || !receiverId) {
      throw new Error("RequestId and ReceiverId are required");
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

    const existingFriend = await Friend.findOne({
      where: { requestId: request.id, state: "active" },
    });

    if (existingFriend) {
      return {
        statuscode: 200,
        message: " we are Already friends🫂",
      };
    }

    await Friend.create({
      requestId: request.id,
      state: "active",
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

export const getFriendsService = async function (userId) {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }

    const friends = await Friend.findAll({
      where: { state: "active" },
    });

    const data = [];

    for (let f of friends) {
      const req = await friendRequest.findByPk(f.requestId);

      if (!req) continue;
      if (req.senderId !== userId && req.receiverId !== userId) {
        continue;
      }
      if (req.status !== "accepted") continue;

      const friendUserId =
        req.senderId === userId ? req.receiverId : req.senderId;

      const user = await User.findByPk(friendUserId, {
        attributes: ["id", "userName"],
      });

      if (user) {
        data.push({
          requestId: f.requestId,
          id: user.id,
          userName: user.userName,
          state: "active",
        });
      }
    }
    if (data.length === 0) {
      return {
        statuscode: 200,
        message:
          "You don't have any friends. Please send a friend request to add friends 🫂",
      };
    }
    return {
      statuscode: 200,
      message: "Friends fetched successfully 👥",
      data,
    };
  } catch (error) {
    throw error;
  }
};

export const removeFriendService = async function (requestId) {
  try {
    if (!requestId) {
      throw new Error("Requested Id is Required !");
    }
    const friend = await Friend.findOne({
      where: { requestId },
    });
    if (!friend) {
      throw new Error("Friend is not Found ❌");
    }
    await Friend.update({ state: "Inactive" }, { where: { requestId } });
    await Friend.destroy({
      where: { requestId },
    });
    await friendRequest.destroy({
      where: { id: requestId },
    });

    return {
      statuscode: 200,
      message: "Friend Deleted Successfully 💔",
    };
  } catch (error) {
    throw error;
  }
};
