const express = require('express');
const router  = express.Router();

const {
  createPet, getPets, getPet,
  getMyListings, updatePet, deletePet,
  adminGetAllPets, adminUpdateApproval,
  applyForPet, getPetApplications,
  updateApplicationStatus, getMyApplications,
} = require('../controllers/petController');

const { protect }                        = require('../middleware/authMiddleware');
const { isRehomer, isAdopter, isAdmin }  = require('../middleware/roleMiddleware');

// ── IMPORTANT: specific named routes BEFORE /:id param routes ──

// Admin
router.get('/admin/all',               protect, isAdmin,   adminGetAllPets);
router.put('/admin/:id/approval',      protect, isAdmin,   adminUpdateApproval);

// Rehomer named routes (must be before /:id)
router.get('/rehomer/my-listings',     protect, isRehomer, getMyListings);

// Adopter named routes (must be before /:id)
router.get('/adopter/my-applications', protect, isAdopter, getMyApplications);

// Public
router.get('/',    getPets);
router.get('/:id', getPet);

// Rehomer param routes (after named routes)
router.post('/',                           protect, isRehomer, createPet);
router.put('/:id',                         protect, isRehomer, updatePet);
router.delete('/:id',                      protect, isRehomer, deletePet);
router.get('/:id/applications',            protect, isRehomer, getPetApplications);
router.put('/:id/applications/:appId',     protect, isRehomer, updateApplicationStatus);

// Adopter param routes
router.post('/:id/apply',                  protect, isAdopter, applyForPet);

module.exports = router;