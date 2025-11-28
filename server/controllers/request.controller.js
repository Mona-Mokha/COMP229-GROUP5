import RequestModel from "../models/request.model.js";
import DonationModel from "../models/donation.model.js";
import { createNotification } from "./notification.controller.js";

// CREATE REQUEST 
export const createRequest = async (req, res) => {
  try {
    const { donationId } = req.body;

    const donation = await DonationModel.findById(donationId);
    if (!donation) {
      return res.status(400).json({ message: "Donation not found." });
    }

    // Prevent users from requesting their own donations
    if (donation.donorId.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot request your own donation." });
    }

    // donations approved by admin can be requested
    if (donation.status !== "Approved") {
      return res.status(400).json({ message: "Donation is not available for request." });
    }

    // Check for existing requests
    const existingRequest = await RequestModel.findOne({ donationId, receiverId: req.user._id });
    if (existingRequest) {
      return res.status(400).json({ message: "You have already requested this item already." });
    }

    const blockedRequest = await RequestModel.findOne({
      donationId,
      status: { $in: ["Approved", "Scheduled", "Completed"] }
    });

    if (blockedRequest) {
      return res.status(400).json({ message: "This donation has already been approved or scheduled." });
    }

    const request = await RequestModel.create({
      donationId,
      receiverId: req.user._id,
      status: "Requested",
    });

    // Send notification to donor
    await createNotification(
      donation.donorId,
      request._id,
      "info",
      `New request for your donation "${donation.title}"`
    );

    res.status(200).json({ message: "Request created successfully", request });

  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET REQUESTS FOR MY DONATIONS
export const getRequestsForMyDonations = async (req, res) => {
  try {
    const donationIds = await DonationModel.distinct("_id", { donorId: req.user._id });

    const allRequests = await RequestModel.find({ donationId: { $in: donationIds } })
      .populate("donationId", "title images donorId")
      .populate("receiverId", "name")
      .sort({ createdAt: -1 });

    const requests = [];

    for (let reqItem of allRequests) {
      if (reqItem.status !== "Rejected") { // only include if not rejected
        requests.push(reqItem);
      }
    }

    res.status(200).json({ message: "Requests for your donations fetched successfully", requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: error.message });
  }
};


// GET REQUESTS BY USER
export const getRequestsByUser = async (req, res) => {
  try {
    const requests = await RequestModel.find({ receiverId: req.user._id })
      .populate("receiverId", "name")
      .populate({
        path: "donationId",
        select: "title images donorId",
        populate: {
          path: "donorId",
          select: "name address city province postal_code phone"
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Your requests fetched successfully", requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE REQUEST
export const getRequestById = async (req, res) => {
  try {
    const request = await RequestModel.findById(req.params.id)
      .populate({
        path: "donationId",
        select: "title donorId status",
        populate: {
          path: "donorId",
          select: "name address city province postal_code"
        }
      })
      .populate("receiverId", "name");

    if (!request) return res.status(404).json({ message: "Request not found." });

    const isDonor = request.donationId.donorId.toString() === req.user._id.toString();
    const isReceiver = request.receiverId._id.toString() === req.user._id.toString();

    if (!isDonor && !isReceiver) {
      return res.status(403).json({ message: "Access denied!" });
    }

    const response = {
      id: request._id,
      donation: {
        id: request.donationId._id,
        title: request.donationId.title,
        donor: {
          id: request.donationId.donorId._id,
          name: request.donationId.donorId.name,
          // only show full address if request is approved
          ...(request.status === "Approved" && {
            address: request.donationId.donorId.address,
            city: request.donationId.donorId.city,
            province: request.donationId.donorId.province,
            postal_code: request.donationId.donorId.postal_code,
          }),
        },
      },
      receiver: {
        id: request.receiverId._id,
        name: request.receiverId.name,
      },
      status: request.status,
      preference: request.preference,
    };

    res.status(200).json(response);

  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ message: error.message });
  }
};


// UPDATE REQUEST
export const updateRequestById = async (req, res) => {
  try {
    const request = await RequestModel.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found." });

    const donation = await DonationModel.findById(request.donationId);
    if (!donation) return res.status(404).json({ message: "Donation not found." });

    const isDonor = donation.donorId.toString() === req.user._id.toString();
    const isReceiver = request.receiverId.toString() === req.user._id.toString();

    if (!isDonor && !isReceiver) {
      return res.status(403).json({ message: "Access denied!" });
    }

    const updates = {};

    if (isDonor) {
      // Donor request status and slots
      if (req.body.status && ["Approved", "Rejected", "Completed"].includes(req.body.status)) {
        updates.status = req.body.status;

        // Send notification to receiver
        await createNotification(
          request.receiverId,
          request._id,
          "info",
          `Your request for "${donation.title}" has been ${updates.status}`
        );
      }
      if (req.body.slots) {
        updates.slots = req.body.slots;
      }
    }

    if (isReceiver) {
      // Receiver select a slot 
      if (req.body.selectedSlot) {
        updates.selectedSlot = req.body.selectedSlot;
        updates.status = "Scheduled";

        // Notify donor
        await createNotification(
          donation.donorId,
          request._id,
          "info",
          `User selected a slot for "${donation.title}"`
        );
      }
    }

    const updatedRequest = await RequestModel.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.status(200).json({ message: "Request updated successfully", request: updatedRequest });
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ message: error.message });
  }
};


// DELETE REQUEST
export const deleteRequestById = async (req, res) => {
  try {
    const request = await RequestModel.findById(req.params.id);

    if (!request) return res.status(404).json({ message: "Request not found." });

    await RequestModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Request deleted successfully." });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ message: error.message });
  }
};
