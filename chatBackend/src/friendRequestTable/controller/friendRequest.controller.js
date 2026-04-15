import {
  createFriendRequestService,
  friendRequestAcceptService,
  rejectFriendRequestService,
  getAllFriendService,
} from "../service/friendRequest.service.js";

export const getAllFriendController = async function (req, res) {
  try {
    const userId = req.user.id;
    const user = await getAllFriendService(userId);
    return res.status(user.statuscode).json({
      message: user.message,
      data: user.data,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const createFriendRequestController = async function (req, res) {
  try {
    const senderId = req.user.id;

    const { receiverId } = req.body;

    const createFriendRequest = await createFriendRequestService({
      senderId,
      receiverId,
    });
    return res.status(createFriendRequest.statuscode).json({
      message: createFriendRequest.message,
      data: createFriendRequest.data,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const friendRequestAcceptController = async function (req, res) {
  try {
    const receiverId = req.user.id;
    const { requestId } = req.body;
    const requestAccept = await friendRequestAcceptService(
      requestId,
      receiverId,
    );
    return res.status(requestAccept.statuscode).json({
      message: requestAccept.message,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const friendRequestRejectController = async function (req, res) {
  try {
    const receiverId = req.user.id;
    const { requestId } = req.body;

    const requestReject = await rejectFriendRequestService(
      requestId,
      receiverId,
    );

    return res.status(requestReject.statuscode).json({
      message: requestReject.message,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
