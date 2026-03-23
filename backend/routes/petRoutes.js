const express = require('express');
const router  = express.Router();

const {
  createPet, getPets, getPet,
  getMyListings, updatePet, deletePet,
  adminGetAllPets, adminUpdateApproval,
  applyForPet, getPetApplications,
  updateApplicationStatus, getMyApplications,
  adminGetAllApplications,
  initiateKhaltiPayment, verifyKhaltiAndApply,
  deleteApplication
} = require('../controllers/petController');

const { protect }                        = require('../middleware/authMiddleware');
const { isRehomer, isAdopter, isAdmin }  = require('../middleware/roleMiddleware');
const upload                             = require('../middleware/uploadMiddleware');

// ── IMPORTANT: specific named routes BEFORE /:id param routes ──

// Admin
router.get('/admin/all',               protect, isAdmin,   adminGetAllPets);
router.put('/admin/:id/approval',      protect, isAdmin,   adminUpdateApproval);
router.get('/admin/applications',      protect, isAdmin,   adminGetAllApplications);
router.put('/admin/applications/:petId/:appId', protect, isAdmin, updateApplicationStatus);

// Rehomer named routes (must be before /:id)
router.get('/rehomer/my-listings',     protect, isRehomer, getMyListings);

// Adopter named routes (must be before /:id)
router.get('/adopter/my-applications', protect, isAdopter, getMyApplications);

// Public
router.get('/',    getPets);
router.get('/:id', getPet);

// Rehomer param routes (after named routes)
router.post('/',      protect, isRehomer, upload.array('images', 5), createPet);
router.put('/:id',   protect, isRehomer, upload.array('images', 5), updatePet);
router.delete('/:id',                      protect, isRehomer, deletePet);
router.get('/:id/applications',            protect, isRehomer, getPetApplications);
router.put('/:id/applications/:appId',     protect, isRehomer, updateApplicationStatus);
router.delete('/:id/applications/:appId',  protect, isRehomer, deleteApplication);

// Adopter param routes
router.post('/:id/apply',                  protect, isAdopter, applyForPet);
router.post('/:id/apply/initiate',         protect, isAdopter, initiateKhaltiPayment);
router.post('/:id/apply/verify',           protect, isAdopter, verifyKhaltiAndApply);

module.exports = router;