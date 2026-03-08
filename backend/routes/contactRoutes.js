const express = require('express');
const router  = express.Router();
const { sendMessage, getMessages, updateStatus, deleteMessage } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

router.post('/',          sendMessage);                        // public
router.get('/',           protect, isAdmin, getMessages);     // admin
router.put('/:id/status', protect, isAdmin, updateStatus);    // admin
router.delete('/:id',     protect, isAdmin, deleteMessage);   // admin

module.exports = router;