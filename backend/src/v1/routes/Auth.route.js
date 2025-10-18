import express from "express";
import { loginController } from "../controllers/index.js";
import authMiddleware from "../middlewares/Auth.middleware.js";

const router = express.Router();

router.post("/login", loginController.login);
router.post("/register", loginController.register);
router.post("/logout", authMiddleware, loginController.logout);
export default router;
