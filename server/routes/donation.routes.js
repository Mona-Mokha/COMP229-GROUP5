import express from "express";
import {
  getAllDonationsPublic,
  getAllDonationsUser,
  createDonation,
  getDonationByIdPublic,
  getDonationById,
  updateDonationById,
  deleteDonationById
} from "../controllers/donation.controller.js";
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public Routes
router.get("/", getAllDonationsPublic);
router.get("/public/:id", getDonationByIdPublic);

// Protected Routes
router.get("/user", authMiddleware, getAllDonationsUser);
router.post("/create", authMiddleware, createDonation);
router.get("/:id", authMiddleware, getDonationById);
router.put("/:id", authMiddleware, updateDonationById);
router.delete("/:id", authMiddleware, deleteDonationById);


export default router;
