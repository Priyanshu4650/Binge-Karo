import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Chat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:5000/messages/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response not ok");
        }

        const json = await response.json();
        setMessages(json.data);
      } catch (e) {
        console.error("Fetch messages error:", e);
      }
    };

    fetchMessages();
  }, [id]);

  const sendMessage = async () => {
    try {
      const response = await fetch("http://localhost:5000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiverId: id, message }),
      });
      if (!response.ok) {
        throw new Error("Network response not ok");
      }

      const json = await response.json();
      setMessages([...messages, json.data]);
      setMessage("");
    } catch (e) {
      console.error("Send message error:", e);
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.message}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
