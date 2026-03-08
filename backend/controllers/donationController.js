const Donation = require('../models/Donation');

// GET all donations — admin only
exports.getDonations = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.paymentStatus = status;

    const skip      = (Number(page) - 1) * Number(limit);
    const total     = await Donation.countDocuments(filter);
    const donations = await Donation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

    // Total amount raised
    const aggregate = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRaised = aggregate[0]?.total || 0;

    res.status(200).json({ success: true, total, totalRaised, data: donations });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET public stats only (no sensitive donor info)
exports.getPublicStats = async (req, res) => {
  try {
    const aggregate = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    res.status(200).json({
      success: true,
      data: {
        totalRaised: aggregate[0]?.total || 0,
        totalDonors: aggregate[0]?.count || 0,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// CREATE donation — public
exports.createDonation = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.user) body.donatedBy = req.user._id;

    // For now mark as completed (real payment gateway integration later)
    body.paymentStatus = 'completed';

    const donation = await Donation.create(body);
    res.status(201).json({ success: true, data: donation });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};