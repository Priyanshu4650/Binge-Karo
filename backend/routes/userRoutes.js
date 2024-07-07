import express from "express";
import { getUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/people", getUsers);

export default router;
