import express from "express";
import authMiddleware from '../middleware/auth.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  getMyProfile,
  getAllUsers,
  getUserById,
  updatePassword,
  deleteUserById,
  updateUserById
} from "../controllers/user.controller.js";


const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes
router.post("/logout", authMiddleware, logoutUser);
router.get("/me", authMiddleware, getMyProfile);
router.get("/", authMiddleware, getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/update-password", authMiddleware, updatePassword);
router.delete("/delete", authMiddleware, deleteUserById);
router.put("/me", authMiddleware, updateUserById);
router.put("/:id", authMiddleware, updateUserById);

export default router;
