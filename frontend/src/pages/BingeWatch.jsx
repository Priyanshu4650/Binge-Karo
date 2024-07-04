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

  return (
    <div>
      <h1>Watch Together</h1>
      <Chat />
    </div>
  );
};

export default BingeWatch;
