const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  isAdmin, 
  isAdopter, 
  isRehomer 
} = require('../middleware/roleMiddleware');

const {
  getProfile,
  updateProfile,
  updatePreferences,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardStats,
} = require('../controllers/userController');

// Public routes (none)

// User routes (requires login)
router.use(protect);

// Get user profile
router.get('/profile', getProfile);

// Update user profile
router.put('/profile', updateProfile);

// Update adoption preferences (adopters only)
router.put('/preferences/adoption', isAdopter, updatePreferences);

// Update rehoming info (rehomers only)
router.put('/info/rehoming', isRehomer, updatePreferences);

// Get dashboard stats based on role
router.get('/dashboard/stats', getDashboardStats);

// Admin routes only
router.use(isAdmin);

// Get all users (admin only)
router.get('/', getUsers);

// Get user by ID (admin only)
router.get('/:id', getUserById);

// Update user (admin only)
router.put('/:id', updateUser);

// Delete user (admin only)
router.delete('/:id', deleteUser);

module.exports = router;