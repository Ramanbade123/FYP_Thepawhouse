const express = require('express');
const router  = express.Router();

const {
  getReports,
  getReport,
  createReport,
  updateReport,
  resolveReport,
  deleteReport,
  uploadPhoto,
} = require('../controllers/lostFoundController');

const { protect, optionalAuth } = require('../middleware/authMiddleware');

// Public — anyone can browse
router.get('/',    getReports);
router.get('/:id', getReport);

// Create — optionalAuth so both guests and logged-in users can post
router.post('/', optionalAuth, uploadPhoto, createReport);

// Protected — must be logged in to update/resolve/delete
router.put('/:id',         protect, uploadPhoto, updateReport);
router.put('/:id/resolve', protect, resolveReport);
router.delete('/:id',      protect, deleteReport);

module.exports = router;