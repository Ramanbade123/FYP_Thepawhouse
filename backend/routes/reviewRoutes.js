const express = require('express');
const router  = express.Router({ mergeParams: true }); // mergeParams to get :petId from parent

const {
  getPetReviews,
  createReview,
  updateReview,
  deleteReview,
  adminGetAllReviews,
  adminUpdateReviewStatus,
} = require('../controllers/reviewController');

const { protect }              = require('../middleware/authMiddleware');
const { isAdmin, isAdopter }   = require('../middleware/roleMiddleware');

// Public
router.get('/', getPetReviews);

// Adopter — create review on a pet
router.post('/', protect, isAdopter, createReview);

// Owner or admin — edit / delete
router.put('/:id',    protect, updateReview);
router.delete('/:id', protect, deleteReview);

// Admin management
router.get('/admin/all',           protect, isAdmin, adminGetAllReviews);
router.put('/admin/:id/status',    protect, isAdmin, adminUpdateReviewStatus);

module.exports = router;