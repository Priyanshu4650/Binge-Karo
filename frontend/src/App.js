import React from "react";
import BingeWatch from "./pages/BingeWatch";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import People from "./components/People";
import Chat from "./components/Chat";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<BingeWatch />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/people" element={<People />} />
          <Route path="/chat/:id" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
