import express from "express";
import { Server } from "socket.io";
import http from "http";

const router = express.Router();
const server = http.createServer(router);
const io = new Server(server);

// Store connected clients
let clients = {};

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Handle joining a room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    clients[socket.id] = roomId;
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Handle sending ICE candidates
  socket.on("iceCandidate", ({ candidate, roomId }) => {
    console.log(`Received ICE candidate for room ${roomId}`);
    socket.to(roomId).emit("iceCandidate", { candidate, socketId: socket.id });
  });

  // Handle sending SDP offers
  socket.on("offer", ({ offer, roomId }) => {
    console.log(`Received offer for room ${roomId}`);
    socket.to(roomId).emit("offer", { offer, socketId: socket.id });
  });

  // Handle sending SDP answers
  socket.on("answer", ({ answer, roomId }) => {
    console.log(`Received answer for room ${roomId}`);
    socket.to(roomId).emit("answer", { answer, socketId: socket.id });
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    const roomId = clients[socket.id];
    if (roomId) {
      socket.to(roomId).emit("userDisconnected", socket.id);
      delete clients[socket.id];
    }
  });
});

export default { server, router };
