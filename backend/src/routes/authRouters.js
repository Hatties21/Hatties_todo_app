import express from "express";
import { register, login, me } from "../controllers/authControllers.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login",    login);
router.get("/me",        auth, me);

export default router;
