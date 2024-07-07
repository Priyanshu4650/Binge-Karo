import React, { useEffect, useRef, useState } from "react";
import useSocket from "../hooks/useSocket";

const VideoChat = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [roomId, setRoomId] = useState("");

  const socket = useSocket();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    initLocalStream();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleJoinRoom = () => {
    const newRoomId = "unique-room-id"; // Generate a unique room ID
    setRoomId(newRoomId);
    socket.emit("joinRoom", newRoomId);

    const peerConnection = new RTCPeerConnection();

    localStream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, localStream));

    peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", {
          candidate: event.candidate,
          roomId: newRoomId,
        });
      }
    };

    socket.on("offer", (offer) => {
      peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      peerConnection.createAnswer().then((answer) => {
        peerConnection.setLocalDescription(answer);
        socket.emit("answer", { answer, roomId: newRoomId });
      });
    });

    socket.on("answer", (answer) => {
      peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    setPeerConnection(peerConnection);
  };

  const handleHangUp = () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
      setLocalStream(null);
      setRemoteStream(null);
      setRoomId("");
    }
  };

  return (
    <div>
      <h1>Video Chat</h1>
      {localStream && (
        <>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "300px", height: "200px", marginBottom: "10px" }}
          />
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ width: "300px", height: "200px" }}
          />
          <div>
            {!roomId ? (
              <button onClick={handleJoinRoom}>Join Room</button>
            ) : (
              <button onClick={handleHangUp}>Hang Up</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VideoChat;
