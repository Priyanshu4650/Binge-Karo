import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  time: { type: Date, default: Date.now },
  message: { type: String, required: true },
  isGroupChat: { type: Boolean, default: false },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
