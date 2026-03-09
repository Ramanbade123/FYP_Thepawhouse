const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: [true, 'Review must belong to a pet'],
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must have a reviewer'],
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a review title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    body: {
      type: String,
      required: [true, 'Please provide review details'],
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
    },
    // Only adopters who applied can review
    verified: {
      type: Boolean,
      default: false,
    },
    // Admin moderation
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved', // auto-approve; admin can remove if needed
    },
    adminNote: { type: String, maxlength: 300, default: '' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// One review per user per pet
reviewSchema.index({ pet: 1, reviewer: 1 }, { unique: true });
reviewSchema.index({ pet: 1, status: 1 });
reviewSchema.index({ reviewer: 1 });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;