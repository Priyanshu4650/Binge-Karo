import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import io from "socket.io-client";

const Chat = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("YES");

    if (!localStorage.getItem("SID")) {
      navigate("/login");
    }
  }, []);

  // const [socket, setSocket] = useState(null);

  // useEffect(() => {
  // const newSocket = io("ws://localhost:5000");
  //   setSocket(newSocket);

  //   newSocket.on("message", (message) => {
  //     setMessages((prevMessages) => [...prevMessages, message]);
  //   });

  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, []);

  const onChange = (e) => {
    e.preventDefault();
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim().length > 0) {
      setMessages((prevMessages) => [
        ...prevMessages,
        `${name} : ${inputValue}`,
      ]);
      // socket.emit("message", inputValue);
      setInputValue("");
    } else {
      alert("Cannot send empty message");
    }
  };

  return (
    <div>
      <h1>Chat Karo</h1>
      <h2>Hi!! {localStorage.getItem("NAME")}</h2>
      <form onSubmit={handleSubmit}>
        <input
          id="message"
          value={inputValue}
          onChange={onChange}
          placeholder="Type your message here..."
        />
        <button type="submit">Submit</button>
      </form>
      <ul className="texts" id="texts">
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
