import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

const mongoURL =
  "mongodb+srv://priyanshu022017:vg8SvKqLo1byu4U5@users.zplos5j.mongodb.net/?retryWrites=true&w=majority&appName=Users";

mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.error(e.message);
  });

// Define the user schema
const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: String,
});

// Create the user model
const Users = mongoose.model("Users", userSchema);

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  time: { type: Date, default: Date.now },
  message: { type: String, required: true },
  isGroupChat: { type: Boolean, default: false },
});

const Messages = mongoose.model("Messages", messageSchema);

const port = 5000;

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

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

app.get("/login", (req, res) => {
  res.json({ title: "Login Page" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const details = await Users.find({ username, password });
    if (details.length > 0) {
      const sessionId = new Date().getTime().toString();
      return res.json({
        success: true,
        message: "Login Successful",
        sessionId,
        name: details[0].name,
        userId: details[0]._id,
      });
    }
    return res.json({ success: false, message: "Invalid credentials" });
  } catch (e) {
    console.error(e.message);
    return res.json({ success: false, message: "An error occurred" });
  }
});

app.get("/register", (req, res) => {
  res.json({ title: "Register Page" });
});

app.post("/register", async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const details = await Users.find({ username });
    if (details.length > 0) {
      return res.json({
        success: false,
        message: "Account already exists",
      });
    }

    const result = await Users.insertMany({ name, username, password });
    return res.json({ success: true, message: "Registered Successfully" });
  } catch (e) {
    console.error(e.message);
    return res.json({ success: false, message: "An error occurred" });
  }
});

app.get("/people", async (req, res) => {
  const results = await Users.find();
  return res.json({ success: true, title: "People", data: results });
});

app.get("/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await Messages.find({
      $or: [{ senderId: id }, { receiverId: id }],
    }).sort({ time: 1 });

    const receiver = await Users.findById(id);
    return res.json({
      success: true,
      data: messages,
      receiverName: receiver ? receiver.name : "",
    });
  } catch (e) {
    console.error(e.message);
  }
});

app.delete("/messages/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    await Messages.findByIdAndDelete(messageId);
    return res.json({ success: true, message: "Message deleted successfully" });
  } catch (e) {
    console.error(e.message);
    return res.json({ success: false, message: "An error occurred" });
  }
});

server.listen(port, () => {
  console.log(`Server listening on PORT: ${port}`);
});
