import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import People from "../components/People";

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
      <People />
    </div>
  );
};

export default BingeWatch;
