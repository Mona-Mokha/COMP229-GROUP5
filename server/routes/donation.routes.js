import express from "express";
import multer from "multer";
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

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
