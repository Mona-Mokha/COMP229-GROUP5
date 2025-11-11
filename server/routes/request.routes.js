const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
      required: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Scheduled', 'Completed'],
      default: 'Pending'
    },
    selectedSlot: {
      type: String 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);
