import express from "express";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";

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

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(messageRoutes);
app.use(userRoutes);

export { app, server, io };
