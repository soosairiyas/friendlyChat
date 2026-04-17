import {
  createFriendRequestService,
  friendRequestAcceptService,
  rejectFriendRequestService,
  getAllFriendService,
  getFriendsService,
  removeFriendService,
  getFriendRequestService,
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

    const receiverId = Number(req.params.id);
    console.log(">>>>>>>>>>>>>ReceiverId", receiverId);

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

export const getFriendRequestController = async function (req, res) {
  try {
    const userId = req.user.id;
    const requests = await getFriendRequestService(userId);
    return res.status(requests.statuscode).json({
      message: requests.message,
      data: requests.data,
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
    const requestId = Number(req.params.id);
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
    const requestId = req.params.id;

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

export const getFriendsController = async function (req, res) {
  try {
    const userId = req.user.id;

    const result = await getFriendsService(userId);

    return res.status(result.statuscode).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const removeFriendController = async function (req, res) {
  try {
    const requestId = Number(req.params.id);
    const removRequest = await removeFriendService(requestId);
    return res.status(removRequest.statuscode).json({
      message: removRequest.message,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
