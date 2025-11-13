import express from "express";
import authMiddleware from '../middleware/auth.js';
import {
  createRequest,
  getRequestsForMyDonations,
  getRequestsByUser,
  getRequestById,
  updateRequestById,
  deleteRequestById
} from "../controllers/request.controller.js";
 
 
const router = express.Router();
 
// Protected Routes
router.post("/", authMiddleware, createRequest);
router.get("/my-donations", authMiddleware, getRequestsForMyDonations);
router.get("/my-requests", authMiddleware, getRequestsByUser);
router.get("/:id", authMiddleware, getRequestById);
router.put("/:id", authMiddleware, updateRequestById);
router.delete("/:id", authMiddleware, deleteRequestById);
 
export default router;
