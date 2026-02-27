const Pet    = require('../models/Pet');
const User   = require('../models/User');
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// ── Multer setup (saves uploaded images to /uploads folder) ──
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `pet_${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (/jpeg|jpg|png|webp/.test(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Only jpg, png, webp images are allowed'), false);
  }
};

exports.upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// ─────────────────────────────────────────────────────────────
// REHOMER: Create listing  →  POST /api/pets
// ─────────────────────────────────────────────────────────────
exports.createPet = async (req, res) => {
  try {
    // multer puts text fields in req.body, file in req.file
    const body = req.body;

    // Build the pet data object, parsing nested fields from FormData
    const petData = {
      name:          body.name,
      breed:         body.breed,
      gender:        body.gender,
      color:         body.color,
      age: {
        value: Number(body['age[value]'] ?? body.age?.value),
        unit:  body['age[unit]']  ?? body.age?.unit ?? 'years',
      },
      size:          body.size         || 'medium',
      description:   body.description,
      vaccinated:    body.vaccinated   === 'true' || body.vaccinated   === true,
      neutered:      body.neutered     === 'true' || body.neutered     === true,
      microchipped:  body.microchipped === 'true' || body.microchipped === true,
      goodWithKids:  body.goodWithKids === 'true' || body.goodWithKids === true,
      goodWithDogs:  body.goodWithDogs === 'true' || body.goodWithDogs === true,
      goodWithCats:  body.goodWithCats === 'true' || body.goodWithCats === true,
      activityLevel: body.activityLevel || 'medium',
      reason:        body.reason,
      rehomingFee:   Number(body.rehomingFee) || 0,
      urgency:       body.urgency || 'medium',
      location: {
        city:    body['location[city]']  ?? body.location?.city  ?? '',
        state:   body['location[state]'] ?? body.location?.state ?? '',
        country: 'Nepal',
      },
      rehomer:       req.user.id,
      adminApproval: 'approved', // listings go live immediately
    };

    // Attach uploaded image if provided
    if (req.file) {
      const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
      petData.primaryImage = `${serverUrl}/uploads/${req.file.filename}`;
      petData.images       = [petData.primaryImage];
    }

    const pet = await Pet.create(petData);

    await User.findByIdAndUpdate(req.user.id, {
      $push: { petsRehomed: { petId: pet._id, petName: pet.name, status: 'approved' } },
    });

    res.status(201).json({ success: true, data: pet });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────
// PUBLIC: Get approved + available pets  →  GET /api/pets
// ─────────────────────────────────────────────────────────────
exports.getPets = async (req, res) => {
  try {
    // Show all available listings to adopters (no admin approval gate)
    const filter = { status: 'available' };

    if (req.query.breed)         filter.breed            = new RegExp(req.query.breed,  'i');
    if (req.query.gender)        filter.gender           = req.query.gender;
    if (req.query.size)          filter.size             = req.query.size;
    if (req.query.city)          filter['location.city'] = new RegExp(req.query.city, 'i');
    if (req.query.activityLevel) filter.activityLevel    = req.query.activityLevel;

    const page  = parseInt(req.query.page,  10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip  = (page - 1) * limit;

    const [pets, total] = await Promise.all([
      Pet.find(filter).populate('rehomer', 'name phone location').sort('-createdAt').skip(skip).limit(limit),
      Pet.countDocuments(filter),
    ]);

    res.status(200).json({ success: true, count: pets.length, total, totalPages: Math.ceil(total / limit), currentPage: page, data: pets });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────
// PUBLIC: Single pet  →  GET /api/pets/:id
// ─────────────────────────────────────────────────────────────
exports.getPet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('rehomer', 'name phone email location');
    if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });
    pet.views += 1;
    await pet.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, data: pet });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────
// REHOMER: My listings  →  GET /api/pets/rehomer/my-listings
// ─────────────────────────────────────────────────────────────
exports.getMyListings = async (req, res) => {
  try {
    const pets = await Pet.find({ rehomer: req.user.id }).sort('-createdAt');

    const stats = {
      total:             pets.length,
      available:         pets.filter(p => p.status === 'available').length,
      pending:           pets.filter(p => p.status === 'pending').length,
      adopted:           pets.filter(p => p.status === 'adopted').length,
      pendingApproval:   pets.filter(p => p.adminApproval === 'pending').length,
      approved:          pets.filter(p => p.adminApproval === 'approved').length,
      rejected:          pets.filter(p => p.adminApproval === 'rejected').length,
      totalApplications: pets.reduce((s, p) => s + p.applications.length, 0),
    };

    res.status(200).json({ success: true, stats, data: pets });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────
// REHOMER: Update listing  →  PUT /api/pets/:id
// ─────────────────────────────────────────────────────────────
exports.updatePet = async (req, res) => {
  try {
    let pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });

    if (pet.rehomer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: pet });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────
// REHOMER: Delete listing  →  DELETE /api/pets/:id
// ─────────────────────────────────────────────────────────────
exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });

    if (pet.rehomer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    await pet.deleteOne();
    res.status(200).json({ success: true, data: {}, message: 'Listing removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────
// ADMIN: Get ALL pets  →  GET /api/pets/admin/all
// ─────────────────────────────────────────────────────────────
exports.adminGetAllPets = async (req, res) => {
  try {
    const filter = {};
    if (req.query.adminApproval) filter.adminApproval = req.query.adminApproval;
    if (req.query.status)        filter.status        = req.query.status;
    if (req.query.breed)         filter.breed         = new RegExp(req.query.breed, 'i');

    const page  = parseInt(req.query.page,  10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip  = (page - 1) * limit;

    const [pets, total] = await Promise.all([
      Pet.find(filter)
        .populate('rehomer',    'name email phone')
        .populate('approvedBy', 'name')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Pet.countDocuments(filter),
    ]);

    const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
      Pet.countDocuments({ adminApproval: 'pending'  }),
      Pet.countDocuments({ adminApproval: 'approved' }),
      Pet.countDocuments({ adminApproval: 'rejected' }),
    ]);

    res.status(200).json({
      success: true,
      count: pets.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      summary: { pending: pendingCount, approved: approvedCount, rejected: rejectedCount },
      data: pets,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────
// ADMIN: Approve or reject a pet → PUT /api/pets/admin/:id/approval
// ─────────────────────────────────────────────────────────────
exports.adminUpdateApproval = async (req, res) => {
  try {
    const { adminApproval, adminNote } = req.body;

    if (!['approved', 'rejected'].includes(adminApproval)) {
      return res.status(400).json({ success: false, error: 'adminApproval must be "approved" or "rejected"' });
    }

    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });

    pet.adminApproval = adminApproval;
    pet.adminNote     = adminNote || '';
    pet.approvedBy    = req.user.id;
    pet.approvedAt    = new Date();

    await pet.save();
    res.status(200).json({ success: true, message: `Pet ${adminApproval}`, data: pet });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────
// ADOPTER: Apply for pet  →  POST /api/pets/:id/apply
// ─────────────────────────────────────────────────────────────
exports.applyForPet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });

    if (pet.status !== 'available') {
      return res.status(400).json({ success: false, error: 'This pet is not available for adoption' });
    }

    const alreadyApplied = pet.applications.some(a => a.adopter.toString() === req.user.id);
    if (alreadyApplied) {
      return res.status(400).json({ success: false, error: 'You have already applied for this pet' });
    }

    pet.applications.push({ adopter: req.user.id, message: req.body.message || '', status: 'pending' });
    pet.status = 'pending';
    await pet.save();

    await User.findByIdAndUpdate(req.user.id, {
      $push: { petsAdopted: { petId: pet._id, petName: pet.name, status: 'pending' } },
    });

    res.status(200).json({ success: true, message: 'Application submitted', data: pet });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────
// REHOMER: Get applications for their pet → GET /api/pets/:id/applications
// ─────────────────────────────────────────────────────────────
exports.getPetApplications = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
      .populate('applications.adopter', 'name email phone adoptionPreferences');

    if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });

    if (pet.rehomer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    res.status(200).json({ success: true, count: pet.applications.length, data: pet.applications });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────
// REHOMER: Approve / reject an application → PUT /api/pets/:id/applications/:appId
// ─────────────────────────────────────────────────────────────
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });

    if (pet.rehomer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const application = pet.applications.id(req.params.appId);
    if (!application) return res.status(404).json({ success: false, error: 'Application not found' });

    application.status = status;

    if (status === 'approved') {
      pet.status      = 'adopted';
      pet.adoptedBy   = application.adopter;
      pet.adoptedDate = new Date();
      pet.applications.forEach(a => {
        if (a._id.toString() !== req.params.appId) a.status = 'rejected';
      });
    }

    await pet.save();
    res.status(200).json({ success: true, data: pet });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────
// ADOPTER: My applications → GET /api/pets/adopter/my-applications
// ─────────────────────────────────────────────────────────────
exports.getMyApplications = async (req, res) => {
  try {
    const pets = await Pet.find({ 'applications.adopter': req.user.id }).populate('rehomer', 'name phone');

    const myApplications = pets.map(pet => {
      const app = pet.applications.find(a => a.adopter.toString() === req.user.id);
      return {
        _id: app._id,
        pet: { _id: pet._id, name: pet.name, breed: pet.breed, ageDisplay: pet.ageDisplay, primaryImage: pet.primaryImage, status: pet.status },
        status:    app.status,
        message:   app.message,
        appliedAt: app.appliedAt,
        rehomer:   pet.rehomer,
      };
    });

    res.status(200).json({ success: true, count: myApplications.length, data: myApplications });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};