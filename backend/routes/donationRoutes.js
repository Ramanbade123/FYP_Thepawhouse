const express = require('express');
const router  = express.Router();
const { getDonations, getPublicStats, createDonation, initiateKhaltiDonation, verifyKhaltiDonation } = require('../controllers/donationController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

router.get('/stats', getPublicStats);
router.get('/',      protect, isAdmin, getDonations);
router.post('/',     optionalAuth, createDonation);

router.post('/khalti/initiate', optionalAuth, initiateKhaltiDonation);
router.post('/khalti/verify',   optionalAuth, verifyKhaltiDonation);

module.exports = router;