import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
    {
        donationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Donation",
            required: true,
        },

        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: ["Requested", "Approved", "Scheduled", "Completed", "Rejected"],
            default: "Requested",
        },
        slots: [
            {
                date: Date,
                startTime: String,
                endTime: String,
            }
        ],
        selectedSlot: {
            date: Date,
            startTime: String,
            endTime: String,
        },
    },
    {
        timestamps: { createdAt: "created", updatedAt: "updated" }
    }
);

export default mongoose.model("Request", requestSchema);
