import { Server } from "socket.io";

const io = new Server();

const handleWebRTCConnection = (socket) => {
  console.log("New WebRTC client connected");

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("offer", (data) => {
    io.to(data.roomId).emit("offer", data.offer);
  });

  socket.on("answer", (data) => {
    io.to(data.roomId).emit("answer", data.answer);
  });

  socket.on("iceCandidate", (data) => {
    io.to(data.roomId).emit("iceCandidate", data.candidate);
  });

  socket.on("disconnect", () => {
    console.log("WebRTC client disconnected");
  });
};

export { handleWebRTCConnection };
