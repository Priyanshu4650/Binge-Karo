import { useEffect, useRef } from "react";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000"; // Replace with your server URL

const useSocket = () => {
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const emit = (eventName, data) => {
    socketRef.current.emit(eventName, data);
  };

  const on = (eventName, callback) => {
    socketRef.current.on(eventName, callback);
  };

  return { emit, on };
};

export default useSocket;
