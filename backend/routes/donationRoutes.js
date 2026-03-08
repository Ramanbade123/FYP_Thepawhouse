const express = require('express');
const router  = express.Router();
const { getDonations, getPublicStats, createDonation } = require('../controllers/donationController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

router.get('/stats', getPublicStats);
router.get('/',      protect, isAdmin, getDonations);
router.post('/',     optionalAuth, createDonation);

module.exports = router;