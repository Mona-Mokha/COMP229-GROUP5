import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
    },

    message: String,
    type: {
      type: String,
      enum: ["info", "alert", "reminder"],
      default: "info",
    },

    read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created" } }
);

export default mongoose.model("Notification", notificationSchema);
 