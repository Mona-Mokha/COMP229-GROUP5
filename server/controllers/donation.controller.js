// server/controllers/donation.controller.js
import Donation from "../models/donation.model.js";

const pick = (obj, fields) =>
  fields.reduce((acc, f) => (obj[f] !== undefined ? { ...acc, [f]: obj[f] } : acc), {});

// GET /api/donations
export async function getAllDonations(req, res) {
  try {
    const { status, type, size, q, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter["items.clothingType"] = type;
    if (size) filter["items.size"] = size;
    if (q) filter.$or = [{ title: new RegExp(q, "i") }, { description: new RegExp(q, "i") }];

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      Donation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Donation.countDocuments(filter),
    ]);

    res.json({ data, page: Number(page), limit: Number(limit), total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list donations" });
  }
}

// GET /api/donations/:id
export async function getDonationById(req, res) {
  try {
    const doc = await Donation.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Donation not found" });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
}

// POST /api/donations
export async function createDonation(req, res) {
  try {
    const body = pick(req.body, [
      "title",
      "description",
      "mainImage",
      "category",
      "exchangePreference",
      "pickupAddress",
      "items",
    ]);

    if (!body.title) return res.status(400).json({ error: "title is required" });
    if (!Array.isArray(body.items) || body.items.length === 0)
      return res.status(400).json({ error: "items[] is required" });

    // optional: require address if pickup/dropoff chosen
    if (["pickup", "dropoff"].includes(body.exchangePreference) && !body.pickupAddress) {
      return res.status(400).json({ error: "pickupAddress required for pickup/dropoff" });
    }

    // If auth later: const userId = req.user.id;
    const doc = await Donation.create({ ...body /* , userId */ });
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Failed to create donation" });
  }
}

// PUT /api/donations/:id
export async function updateDonation(req, res) {
  try {
    const updates = pick(req.body, [
      "title",
      "description",
      "mainImage",
      "category",
      "exchangePreference",
      "pickupAddress",
      "items",
      "status",
    ]);

    const doc = await Donation.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!doc) return res.status(404).json({ error: "Donation not found" });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Failed to update donation" });
  }
}

// DELETE /api/donations/:id
export async function deleteDonation(req, res) {
  try {
    const doc = await Donation.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Donation not found" });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
}

// PATCH /api/donations/:id/status
export async function setDonationStatus(req, res) {
  try {
    const allowed = ["Pending", "Published", "Requested", "Approved", "Scheduled", "Completed"];
    const { status } = req.body;
    if (!allowed.includes(status)) return res.status(400).json({ error: "Invalid status" });

    const doc = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ error: "Donation not found" });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to set status" });
  }
}
