import Message from "../models/Message.js";
import User from "../models/User.js";
import { Server } from "socket.io";

const io = new Server();

const sendMessage = async ({ senderId, receiverId, message }) => {
  try {
    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();
    io.emit("receiveMessage", newMessage);
  } catch (e) {
    console.error("Error saving message:", e);
  }
};

const deleteMessage = async (messageId) => {
  try {
    await Message.findByIdAndDelete(messageId);
    io.emit("messageDeleted", messageId);
  } catch (e) {
    console.error("Error deleting message:", e);
  }
};

const getMessages = async (id) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: id }, { receiverId: id }],
    }).sort({ time: 1 });

    const receiver = await User.findById(id);
    return {
      success: true,
      data: messages,
      receiverName: receiver ? receiver.name : "",
    };
  } catch (e) {
    console.error(e.message);
    return { success: false, message: "An error occurred" };
  }
};

export { sendMessage, deleteMessage, getMessages };
