import DonationModel from "../models/donation.model.js";


// PUBLIC: Only approved donations
export const getAllDonationsPublic = async (req, res) => {
  try {
    const donations = await DonationModel.find({ status: "Approved" })
      .populate("donorId", "name")
      .sort({ created: -1 });

    res.status(200).json({ message: "Donations fetched successfully", donations });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ message: error.message });
  }
};


// AUTHENTICATED USERS
export const getAllDonationsUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let filter;

    if (userRole === "Admin") {
      // Admin sees all donations
      filter = {};
    } else {
      // User sees own donations 
      filter = {
        $or: [
          { donorId: userId },
        ]
      };
    }

    const donations = await DonationModel.find(filter)
      .populate("donorId", "name")
      .sort({ created: -1 });

    res.status(200).json({ message: "Donations fetched successfully", donations });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ message: error.message });
  }
};


// CREATE DONATION 
export const createDonation = async (req, res) => {
  try {

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "You must login or register to create a donation." });
    }

    const { type, title, description, images, category, size, condition, preference } = req.body;

    const donation = await DonationModel.create({
      donorId: req.user._id,
      type,
      title,
      description,
      images: images || [],
      category,
      size,
      condition,
      preference,
      status: "Pending",
      reviewedBy: null,
    });

    res.status(200).json({ message: "Donation created successfully", donation });
  } catch (error) {
    console.error("Error creating donation:", error);
    res.status(500).json({ message: error.message });
  }
};


// GET DONATION BY ID
export const getDonationById = async (req, res) => {
  try {
    const donation = await DonationModel.findById(req.params.id)
      .populate("donorId", "name")
      .populate("reviewedBy", "name");

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Access control
    const isDonor = donation.donorId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "Admin";
    if (!isAdmin && !isDonor && donation.status !== "Approved") {
      return res.status(403).json({ message: "Access denied!" });
    }

    res.status(200).json(donation);

  } catch (error) {
    console.error("Error fetching donation:", error);
    res.status(500).json({ message: error.message });
  }
};


// UPDATE DONATION
export const updateDonationById = async (req, res) => {
  try {
    const donation = await DonationModel.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    const isAdmin = req.user.role === "Admin";
    const isDonor = donation.donorId._id.toString() === req.user._id.toString();

    if (!isAdmin && !isDonor) {
      return res.status(403).json({ message: "Access denied!" });
    }

    const updates = {};

    // Donor can update only their own fields
    if (isDonor) {

      const donorFields = ['title', 'description', 'images', 'category', 'size', 'condition', 'preference'];
      donorFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });
    }

    if (isAdmin) { // Admin can only update status and reviewedBy
      if (req.body.status) updates.status = req.body.status;
      if (req.body.reviewedBy) updates.reviewedBy = req.body.reviewedBy;
    }

    const updatedDonation = await DonationModel.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.status(200).json({ message: "Donation updated successfully", donation: updatedDonation });
  } catch (error) {
    console.error("Error updating donation:", error);
    res.status(500).json({ message: error.message });
  }
};


// DELETE DONATION
export const deleteDonationById = async (req, res) => {
  try {
    const donationId = req.params.id;
    const donation = await DonationModel.findById(donationId);

    if (!donation)
      return res.status(404).json({ message: "Donation not found" });

    const isDonor = donation.donorId.toString() === req.user._id.toString();

    if (!isDonor) {
      return res.status(403).json({ message: "Access denied!" });
    }

    await DonationModel.findByIdAndDelete(donationId);

    res.status(200).json({ message: "Donation deleted successfully" });
  } catch (error) {
    console.error("Error deleting donation:", error);
    res.status(500).json({ message: error.message });
  }
};



