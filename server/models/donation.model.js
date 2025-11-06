import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
    {
        donorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: String,
        title: String,
        description: String,
        images: [String],
        mainImage: String,
        category: String,
        size: String,
        condition: String,
        preference: String,

        status: {
            type: String,
            default: "Pending",
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: { createdAt: "created", updatedAt: "updated" }
    }
);

export default mongoose.model("Donation", donationSchema);
