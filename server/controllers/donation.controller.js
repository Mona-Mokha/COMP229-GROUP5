import fs from "fs";
import path from "path";
import DonationModel from "../models/donation.model.js";


// PUBLIC: Only approved donations
export const getAllDonationsPublic = async (req, res) => {
  try {
    const donations = await DonationModel.find({ status: "Approved" })
      .populate("donorId", "name city province")
      .sort({ created: -1 });

    const response = donations.map(donation => ({
      id: donation._id,
      donor: donation.donorId
        ? {
          name: donation.donorId.name,
          city: donation.donorId.city,
          province: donation.donorId.province,
        }
        : null,
      type: donation.type,
      title: donation.title,
      description: donation.description,
      images: donation.images,
      category: donation.category,
      size: donation.size,
      condition: donation.condition,
      preference: donation.preference,
      status: donation.status,
    }));

    res.status(200).json({ message: "Donations fetched successfully", donation: response });
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
      .populate("donorId", "name city province")
      .sort({ created: -1 });

    const response = donations.map(donation => ({
      id: donation._id,
      donor: donation.donorId
        ? {
          name: donation.donorId.name,
          city: donation.donorId.city,
          province: donation.donorId.province,
        }
        : null,
      type: donation.type,
      title: donation.title,
      description: donation.description,
      images: donation.images,
      category: donation.category,
      size: donation.size,
      condition: donation.condition,
      preference: donation.preference,
      status: donation.status,
    }));


    res.status(200).json({ message: "Donations fetched successfully", donations: response });

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

    const { title, description, category, size, condition, preference } = req.body;

    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const donation = await DonationModel.create({
      donorId: req.user._id,
      title,
      description,
      images,
      category,
      size,
      condition,
      preference,
      status: "Pending",
      reviewedBy: null,
    });

    res.status(200).json({
      message: "Donation created successfully", donation: {
        donorId: donation._id,
        title: donation.title,
        description: donation.description,
        images: donation.images,
        category: donation.category,
        size: donation.size,
        condition: donation.condition,
        preference: donation.preference,
        status: donation.status,
      }
    });
  } catch (error) {
    console.error("Error creating donation:", error);
    res.status(500).json({ message: error.message });
  }
};


// PUBLIC: GET DONATION BY ID (only if approved)
export const getDonationByIdPublic = async (req, res) => {
  try {
    const donation = await DonationModel.findById(req.params.id)
      .populate("donorId", "name city province")
      .populate("reviewedBy", "name");

    if (!donation) return res.status(404).json({ message: "Donation not found" });

    // Only allow public to view approved donations
    if (donation.status !== "Approved") {
      return res.status(403).json({ message: "Access denied! Donation not approved." });
    }

    const response = {
      id: donation._id,
      donor: donation.donorId
        ? {
          name: donation.donorId.name,
          city: donation.donorId.city,
          province: donation.donorId.province,
        }
        : null,
      type: donation.type,
      title: donation.title,
      description: donation.description,
      images: donation.images,
      category: donation.category,
      size: donation.size,
      condition: donation.condition,
      preference: donation.preference,
      status: donation.status,
    };

    res.status(200).json({ message: "Donation fetched successfully", donation: response });
  } catch (error) {
    console.error("Error fetching donation:", error);
    res.status(500).json({ message: error.message });
  }
};


// GET DONATION BY ID
export const getDonationById = async (req, res) => {
  try {
    const donation = await DonationModel.findById(req.params.id)
      .populate("donorId", "name city province")
      .populate("reviewedBy", "name");

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    const isDonor = donation.donorId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "Admin";

    // Only donor can view their pending donation; others see only approved
    if (!isAdmin && !isDonor && donation.status !== "Approved") {
      return res.status(403).json({ message: "Access denied!" });
    }

    const response = {
      id: donation._id,
      donor: donation.donorId
        ? {
          name: donation.donorId.name,
          city: donation.donorId.city,
          province: donation.donorId.province,
        }
        : null,
      type: donation.type,
      title: donation.title,
      description: donation.description,
      images: donation.images,
      category: donation.category,
      size: donation.size,
      condition: donation.condition,
      preference: donation.preference,
      status: donation.status,
    };

    res.status(200).json({ message: "Donation fetched successfully", donation: response });
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

      const existingImages = JSON.parse(req.body.existingImages || "[]");
      const newImages = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
      const finalImages = [...existingImages, ...newImages];

      const donorFields = ['title', 'description', 'images', 'category', 'size', 'condition', 'preference'];
      donorFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });
      updates.images = finalImages; 
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

    // delete images from /uploads folder
    donation.images.forEach(img => {
      if (donation.images && donation.images.length > 0) {
        const fileName = img.replace("/uploads/", "").replace("uploads/", "");
        const filePath = path.join(process.cwd(), "uploads", fileName);

        fs.unlink(filePath, err => {
          if (err) {
            console.error("Error deleting image:", err);
          } else {
            console.log("Deleted image:", filePath);
          }
        });
      }
    });

    await DonationModel.findByIdAndDelete(donationId);

    res.status(200).json({ message: "Donation deleted successfully" });
  } catch (error) {
    console.error("Error deleting donation:", error);
    res.status(500).json({ message: error.message });
  }
};



