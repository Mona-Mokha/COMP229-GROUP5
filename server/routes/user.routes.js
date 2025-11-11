import express from "express";
import {
  registerUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes
router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);
router.delete("/me", authMiddleware, deleteMyAccount);

export default router;
