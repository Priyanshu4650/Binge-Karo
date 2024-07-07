import express from "express";
import { login, register } from "../controllers/userController.js";

const router = express.Router();

router.get("/login", (req, res) => {
  res.json({ title: "Login Page" });
});

router.post("/login", login);

router.get("/register", (req, res) => {
  res.json({ title: "Register Page" });
});

router.post("/register", register);

export default router;
