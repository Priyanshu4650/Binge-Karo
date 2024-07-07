import express from "express";
import {
  deleteMessage,
  getMessages,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/messages/:id", async (req, res) => {
  const { id } = req.params;
  const result = await getMessages(id);
  return res.json(result);
});

router.delete("/messages/:messageId", async (req, res) => {
  const { messageId } = req.params;
  const result = await deleteMessage(messageId);
  return res.json(result);
});

export default router;
