import express from "express";
import authMiddleware from '../middleware/auth.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserById,
  updateUserById,
  updatePassword,
  deleteUserById
} from "../controllers/user.controller.js";
 
 
const router = express.Router();
 
// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
 
// Protected Routes
router.post("/logout", authMiddleware, logoutUser);
router.get("/", authMiddleware, getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUserById);
router.put("/:id/password", authMiddleware, updatePassword);
router.delete("/:id", authMiddleware, deleteUserById);
 
export default router;