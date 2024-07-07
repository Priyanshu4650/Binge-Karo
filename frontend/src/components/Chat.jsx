import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("https://binge-karo-5.onrender.com");

const Chat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [receiverName, setReceiverName] = useState("");

  useEffect(() => {
    // Request notification permission
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Fetch the logged-in user ID from localStorage or any other state management
    const fetchUserId = () => {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    };
    fetchUserId();

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `https://binge-karo-5.onrender.com/messages/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response not ok");
        }

        const json = await response.json();
        setMessages(json.data);
        setReceiverName(json.receiverName);
        console.log(json);
      } catch (e) {
        console.error("Fetch messages error:", e);
      }
    };

    fetchMessages();

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      // Check if the document is hidden
      if (document.hidden) {
        showNotification(newMessage.message);
      }
    });

    socket.on("messageDeleted", (messageId) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== messageId)
      );
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messageDeleted");
    };
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message.trim() === "") return;
    socket.emit("sendMessage", { senderId: userId, receiverId: id, message });
    setMessage("");
  };

  const handleDelete = async (messageId) => {
    try {
      await fetch(`http://localhost:5000/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      socket.emit("deleteMessage", messageId);
    } catch (e) {
      console.error("Delete message error:", e);
    }
  };

  const showNotification = (message) => {
    if (Notification.permission === "granted") {
      new Notification("New Message", {
        body: message,
      });
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      <form onSubmit={handleSubmit}>
        <div>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.senderId === userId ? "Me" : receiverName}: </strong>
              {msg.message}
              {msg.senderId === userId && (
                <button onClick={() => handleDelete(msg._id)}>Delete</button>
              )}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
