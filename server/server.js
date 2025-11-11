// server/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// load /server/.env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// health check
app.get("/", (_req, res) => res.json({ ok: true, service: "WearShare API" }));

// --- DB connect ---
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("Missing MONGO_URI in /server/.env");
  process.exit(1);
}

mongoose
  .connect(uri, { serverSelectionTimeoutMS: 30000 })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Unable to connect to database:", err.message));

// --- Routes ---
// Donations
import donationRoutes from "./routes/donation.routes.js";
app.use("/api/donations", donationRoutes);

// ✅ Users
import userRoutes from "./routes/user.routes.js";
app.use("/api/users", userRoutes);

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
