const express = require('express');
const router  = express.Router();

const {
  register, login, getMe, updateDetails,
  updatePassword, logout, forgotPassword, resetPassword,
} = require('../controllers/authController');

const {
  getProfile, updateProfile, updatePreferences, toggleFavorite,
  getDashboardStats, getUsers, getUserById, updateUser, deleteUser, toggleActiveStatus
} = require('../controllers/userController');

const { protect }  = require('../middleware/authMiddleware');
const { isAdmin }  = require('../middleware/roleMiddleware');
const upload       = require('../middleware/uploadMiddleware');

// ── Public ────────────────────────────────────────────────────
router.post('/register',                  register);
router.post('/login',                     login);
router.post('/forgotpassword',            forgotPassword);
router.put('/resetpassword/:resettoken',  resetPassword);

// ── Authenticated ─────────────────────────────────────────────
router.get('/me',              protect, getMe);
router.put('/updatedetails',   protect, updateDetails);
router.put('/updatepassword',  protect, updatePassword);
router.get('/logout',          protect, logout);
router.get('/profile',         protect, getProfile);
router.put('/profile',         protect, upload.single('profileImage'), updateProfile);
router.put('/preferences/:type', protect, updatePreferences);
router.post('/favorites/:petId', protect, toggleFavorite);
router.get('/dashboard/stats', protect, getDashboardStats);

// ── Admin only ────────────────────────────────────────────────
router.get('/',     protect, isAdmin, getUsers);
router.get('/:id',  protect, isAdmin, getUserById);
router.put('/:id/toggle-status', protect, isAdmin, toggleActiveStatus);
router.delete('/:id', protect, isAdmin, deleteUser);

module.exports = router;