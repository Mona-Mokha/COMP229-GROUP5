// server/models/donation.model.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    clothingType: { type: String, required: true }, // e.g., Jacket, Shirt
    size: { type: String },                          // e.g., S, M, L, 6, 8
    condition: {
      type: String,
      enum: ["New", "Like New", "Used", "Worn"],
      default: "Used",
    },
    images: [{ type: String }],                      // optional extra images
    quantity: { type: Number, default: 1, min: 1 },
  },
  { _id: false }
);

const donationSchema = new mongoose.Schema(
  {
    // make userId optional 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    title: { type: String, required: true },
    description: { type: String },
    mainImage: { type: String },

    category: { type: String }, // e.g., Kids, Men, Women
    exchangePreference: {
      type: String,
      enum: ["pickup", "dropoff", "none"],
      default: "none",
    },
    pickupAddress: { type: String },

    status: {
      type: String,
      enum: ["Pending", "Published", "Requested", "Approved", "Scheduled", "Completed"],
      default: "Pending",
      index: true,
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // unified single/bundle via items[]
    items: {
      type: [itemSchema],
      validate: [(arr) => Array.isArray(arr) && arr.length > 0, "items[] is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Donation", donationSchema);
