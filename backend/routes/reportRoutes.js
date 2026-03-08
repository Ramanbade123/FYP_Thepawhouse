const express = require('express');
const router  = express.Router();
const { getReports, getReport, createReport, updateReport, deleteReport, uploadPhoto } = require('../controllers/reportController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

router.get('/',    protect, isAdmin, getReports);
router.get('/:id', protect, isAdmin, getReport);
router.post('/',   optionalAuth, uploadPhoto, createReport);
router.put('/:id', protect, isAdmin, updateReport);
router.delete('/:id', protect, isAdmin, deleteReport);

module.exports = router;