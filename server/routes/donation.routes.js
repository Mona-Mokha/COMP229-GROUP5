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
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getAllDonationsPublic);
router.get("/public/:id", getDonationByIdPublic);

// Protected Routes
router.get("/user", authMiddleware, getAllDonationsUser);
router.post("/create", authMiddleware, upload.array("images", 5), createDonation);
router.get("/:id", authMiddleware, getDonationById);
router.put("/:id", authMiddleware, upload.array('images', 5), updateDonationById);
router.delete("/:id", authMiddleware, deleteDonationById);


export default router;
