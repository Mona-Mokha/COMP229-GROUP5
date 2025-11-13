import express from "express";
import authMiddleware from '../middleware/auth.js';
import {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";
 
const router = express.Router();
 
// Protected Routes    
router.get("/", authMiddleware, getUserNotifications);
router.put("/:id", authMiddleware, markNotificationAsRead);
router.delete("/:id", authMiddleware, deleteNotification);
 
export default router;