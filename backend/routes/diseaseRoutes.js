const express = require('express');
const router  = express.Router();
const { getDiseases, getDisease, createDisease, updateDisease, deleteDisease } = require('../controllers/diseaseController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

router.get('/',    getDiseases);
router.get('/:id', getDisease);
router.post('/',      protect, isAdmin, createDisease);
router.put('/:id',    protect, isAdmin, updateDisease);
router.delete('/:id', protect, isAdmin, deleteDisease);

module.exports = router;