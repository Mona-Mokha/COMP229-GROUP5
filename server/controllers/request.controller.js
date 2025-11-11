const Request = require('../models/Request');

exports.createRequest = async (req, res) => {
  try {
    const { donationId } = req.body;
    const receiverId = req.user._id;

    const existingRequest = await Request.findOne({ donationId, receiverId });
    if (existingRequest) {
      return res.status(400).json({ message: 'You already requested this item.' });
    }

    const request = await Request.create({ donationId, receiverId });
    res.status(201).json({ message: 'Request created successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'Error creating request', error: error.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'donor') {
      filter = { donorId: req.user._id };
    }

    const requests = await Request.find(filter)
      .populate('receiverId', 'name email')
      .populate('donationId', 'title category')
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('receiverId', 'name email')
      .populate('donationId', 'title category donorId');

    if (!request) return res.status(404).json({ message: 'Request not found' });

    const isOwner =
      request.receiverId._id.toString() === req.user._id.toString() ||
      request.donationId.donorId.toString() === req.user._id.toString() ||
      req.user.role === 'admin';

    if (!isOwner) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching request', error: error.message });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const { status, selectedSlot } = req.body;
    const request = await Request.findById(req.params.id).populate('donationId', 'donorId');

    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (req.user.role === 'receiver' && request.receiverId.toString() === req.user._id.toString()) {
      request.selectedSlot = selectedSlot || request.selectedSlot;
    } else if (req.user.role === 'donor' && request.donationId.donorId.toString() === req.user._id.toString()) {
      if (status) request.status = status;
    } else if (req.user.role === 'admin') {
      if (status) request.status = status;
      if (selectedSlot) request.selectedSlot = selectedSlot;
    } else {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    await request.save();
    res.status(200).json({ message: 'Request updated successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'Error updating request', error: error.message });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const isAuthorized =
      req.user.role === 'admin' ||
      request.receiverId.toString() === req.user._id.toString();

    if (!isAuthorized)
      return res.status(403).json({ message: 'Not authorized to delete this request' });

    await request.deleteOne();
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting request', error: error.message });
  }
};
