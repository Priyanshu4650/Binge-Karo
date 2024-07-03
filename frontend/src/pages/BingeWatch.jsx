import React, { useEffect } from "react";
import Chat from "../components/Chat";
import { useNavigate } from "react-router-dom";

const BingeWatch = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("SID")) {
      navigate("/login");
    }
  });

  const handleClick = async () => {
    if (localStorage.getItem("SID")) {
      localStorage.clear();
      navigate("/");
    } else {
      alert("Bhai kaise karega tu ye");
    }
  };
  return (
    <div>
      <h1>Watch Together</h1>
      <Chat />
      <button onClick={handleClick}>Logout</button>
    </div>
  );
};

export default BingeWatch;
