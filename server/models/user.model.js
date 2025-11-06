import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    passwordHash: String,

    role: {
      type: String,
      enum: ["donor", "receiver", "admin"],
      required: true,
    },

    phone: String,
    address: String,
    city: String,
    province: String,
    postal_code: String,
  },
  { 
    timestamps: { createdAt: "created", updatedAt: "updated" } 
  }
);

export default mongoose.model("User", userSchema);
