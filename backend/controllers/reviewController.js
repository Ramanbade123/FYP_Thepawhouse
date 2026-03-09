const Review = require('../models/Review');
const Pet    = require('../models/Pet');

// GET all reviews for a pet — public
exports.getPetReviews = async (req, res) => {
  try {
    const { petId } = req.params;
    const reviews = await Review.find({ pet: petId, status: 'approved' })
      .populate('reviewer', 'name profileImage role')
      .sort({ createdAt: -1 });

    const avg = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.status(200).json({ success: true, count: reviews.length, avgRating: Number(avg), data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST create a review — adopter only, must have applied for this pet
exports.createReview = async (req, res) => {
  try {
    const { petId } = req.params;
    const { rating, title, body } = req.body;

    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });

    // Check if user already reviewed this pet
    const existing = await Review.findOne({ pet: petId, reviewer: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, error: 'You have already reviewed this dog' });
    }

    // Check if user applied for this pet (verified review)
    const applied = pet.applications.some(
      (app) => app.adopter.toString() === req.user._id.toString()
    );

    const review = await Review.create({
      pet: petId,
      reviewer: req.user._id,
      rating,
      title,
      body,
      verified: applied,
    });

    await review.populate('reviewer', 'name profileImage role');

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, error: 'You have already reviewed this dog' });
    }
    res.status(400).json({ success: false, error: err.message });
  }
};

// PUT update own review — reviewer only
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, error: 'Review not found' });

    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorised to edit this review' });
    }

    const { rating, title, body } = req.body;
    if (rating !== undefined) review.rating = rating;
    if (title  !== undefined) review.title  = title;
    if (body   !== undefined) review.body   = body;

    await review.save();
    await review.populate('reviewer', 'name profileImage role');
    res.status(200).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// DELETE own review — reviewer or admin
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, error: 'Review not found' });

    const isOwner = review.reviewer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, error: 'Not authorised to delete this review' });
    }

    await review.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── ADMIN ─────────────────────────────────────────────────────────────────────

// GET all reviews — admin
exports.adminGetAllReviews = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip    = (Number(page) - 1) * Number(limit);
    const total   = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
      .populate('reviewer', 'name email role')
      .populate('pet', 'name breed primaryImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT update review status — admin (approve / reject)
exports.adminUpdateReviewStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true, runValidators: true }
    ).populate('reviewer', 'name email');

    if (!review) return res.status(404).json({ success: false, error: 'Review not found' });
    res.status(200).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};