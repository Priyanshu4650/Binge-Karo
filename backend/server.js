import { app, server, io } from "./app.js";

const port = 5000;

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    try {
      const newMessage = new Messages({ senderId, receiverId, message });
      await newMessage.save();
      io.emit("receiveMessage", newMessage);
    } catch (e) {
      console.error("Error saving message:", e);
    }
  });

  socket.on("deleteMessage", async (messageId) => {
    try {
      await Messages.findByIdAndDelete(messageId);
      io.emit("messageDeleted", messageId);
    } catch (e) {
      console.error("Error deleting message:", e);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server listening on PORT: ${port}`);
});
