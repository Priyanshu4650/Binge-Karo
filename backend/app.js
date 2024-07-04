import express from "express";
import mongoose from "mongoose";
import cors from "cors";

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

app.listen(port, () => {
  console.log(`Server listening on PORT: ${port}`);
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
  const { id } = req.params;
  console.log(id);
  const messages = await Messages.find({
    $or: [{ senderId: id }, { receiverId: id }],
  }).sort({ time: 1 });
  return res.json({ success: true, data: messages });
});

app.post("/messages", async (req, res) => {
  const { senderId, receiverId, message } = req.body;
  const newMessage = new Messages({ senderId, receiverId, message });
  await newMessage.save();
  return res.json({ success: true, data: newMessage });
});

// import { Server } from "socket.io";
// const expressServer = app.listen(port, () => {
//   console.log(`Server listening on PORT: ${port}`);
// });

// const io = new Server(expressServer, {
//   cors: {
//     origin: [
//       "http://192.168.29.65:3000",
//       "http://localhost:3000",
//       "http://127.0.0.1:5500",
//     ],
//   },
// });

// io.on("connection", (socket) => {
//   console.log(`${socket.id} is connected....`);

//   // to send a message
//   socket.on("message", (message) => {
//     if (message.substring(0, 5) !== "You: ") {
//       io.emit("message", `${message}`);
//     }
//   });

//   // when it gets disconnected
//   socket.on("disconnect", () => {
//     console.log(`${socket.id} got disconnected`);
//   });
// });
