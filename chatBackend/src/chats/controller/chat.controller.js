import {
  getMessagesService,
  sendMessageService,
} from "../service/chat.service.js";
export const sendMessageController = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, message } = req.body;

    const chat = await sendMessageService({
      senderId,
      receiverId,
      message,
    });

    res.status(201).json({
      message: "Message sent successfully ✅",
      data: chat,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getMessagesController = async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = Number(req.params.id);

    const messages = await getMessagesService(userId, otherUserId);

    res.json({ data: messages });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
