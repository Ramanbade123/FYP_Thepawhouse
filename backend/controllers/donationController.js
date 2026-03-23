const Donation = require('../models/Donation');
const axios    = require('axios');

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

// ── KHALTI INITIATE ──────────────────────────────────────────
exports.initiateKhaltiDonation = async (req, res) => {
  try {
    const { amount, donorName, donorEmail, donorPhone, purpose, message, anonymous } = req.body;
    
    if (!amount || amount < 1) return res.status(400).json({ success: false, error: 'Invalid amount' });

    // Create a pending donation record
    const donation = await Donation.create({
      donorName: anonymous ? 'Anonymous' : donorName,
      donorEmail,
      donorPhone,
      amount,
      purpose,
      message,
      anonymous,
      paymentMethod: 'khalti',
      paymentStatus: 'pending',
      donatedBy: req.user ? req.user._id : null
    });

    const amountPaisa = amount * 100;
    const purchase_order_id = `donation_${donation._id}`;
    const purchase_order_name = `Donation for ${purpose || 'General Fund'}`;
    const return_url = `${process.env.FRONTEND_URL}/donate/verify`;

    const khaltiPayload = {
      return_url,
      website_url: process.env.FRONTEND_URL,
      amount: amountPaisa,
      purchase_order_id,
      purchase_order_name,
      customer_info: {
        name: donorName || 'Donor',
        email: donorEmail || 'donor@example.com',
        phone: donorPhone || '9800000000'
      }
    };

    const khaltiResponse = await axios.post(
      'https://a.khalti.com/api/v2/epayment/initiate/',
      khaltiPayload,
      {
        headers: {
          'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (khaltiResponse.data && khaltiResponse.data.payment_url) {
      // Save pidx to donation
      donation.pidx = khaltiResponse.data.pidx;
      await donation.save();

      res.status(200).json({ 
        success: true, 
        payment_url: khaltiResponse.data.payment_url,
        pidx: khaltiResponse.data.pidx,
        donationId: donation._id
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to initiate Khalti payment' });
    }
  } catch (err) {
    console.error('Khalti initiate error:', err.response ? err.response.data : err.message);
    res.status(500).json({ success: false, error: 'Server error while initiating payment' });
  }
};

// ── KHALTI VERIFY ────────────────────────────────────────────
exports.verifyKhaltiDonation = async (req, res) => {
  try {
    const { pidx } = req.body;
    if (!pidx) return res.status(400).json({ success: false, error: 'Missing pidx' });

    // Verify payment status with Khalti
    const khaltiResponse = await axios.post(
      'https://a.khalti.com/api/v2/epayment/lookup/',
      { pidx },
      {
        headers: {
          'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (khaltiResponse.data && khaltiResponse.data.status === 'Completed') {
      const donation = await Donation.findOne({ pidx });
      if (!donation) return res.status(404).json({ success: false, error: 'Donation record not found' });

      donation.paymentStatus = 'completed';
      donation.transactionId = pidx;
      await donation.save();

      res.status(200).json({ success: true, message: 'Donation success', data: donation });
    } else {
      res.status(400).json({ success: false, error: 'Payment verification failed' });
    }
  } catch (err) {
    console.error('Khalti verify error:', err.response ? err.response.data : err.message);
    res.status(500).json({ success: false, error: 'Server error while verifying payment' });
  }
};