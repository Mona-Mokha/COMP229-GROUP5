// server/routes/donation.routes.js
import { Router } from "express";
import {
  createDonation,
  getAllDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
  setDonationStatus,
} from "../controllers/donation.controller.js";

// import { auth, permit } from "../middleware/auth.js";

const router = Router();

router.get("/", getAllDonations);
router.get("/:id", getDonationById);
router.post("/", /* auth, permit("donor","admin"), */ createDonation);
router.put("/:id", /* auth, */ updateDonation);
router.delete("/:id", /* auth, */ deleteDonation);
router.patch("/:id/status", /* auth, permit("admin"), */ setDonationStatus);

export default router;
