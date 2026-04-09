const Pet  = require('../models/Pet');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const axios = require('axios'); // Add axios for Khalti HTTP requests
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// ─────────────────────────────────────────────────────────────
// REHOMER: Create listing  →  POST /api/pets
// ─────────────────────────────────────────────────────────────
exports.createPet = async (req, res) => {
  try {
    const existingPet = await Pet.findOne({
      rehomer: req.user.id,
      name: new RegExp(`^${req.body.name}$`, 'i'),
      breed: new RegExp(`^${req.body.breed}$`, 'i')
    });
    if (existingPet) {
      return res.status(400).json({ success: false, error: 'You have already listed a dog with this exact name and breed.' });
    }

    req.body.rehomer       = req.user.id;
    req.body.adminApproval = 'approved'; // automatically approved

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => `/uploads/pets/${file.filename}`);
      req.body.primaryImage = imageUrls[0];
      req.body.images = imageUrls;
    }

    const pet = await Pet.create(req.body);

    await User.findByIdAndUpdate(req.user.id, {
      $push: { petsRehomed: { petId: pet._id, petName: pet.name, status: 'pending' } },
    });

    // Create notification for admins
    try {
      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        await Notification.create({
          recipient: admin._id,
          type: 'system',
          title: 'New Pet Listing',
          message: `${req.user.name} has listed a new pet: ${pet.name}. Approval required.`,
          link: '/admin/dashboard?tab=pets'
        });
      }
    } catch (notifErr) { console.error('Admin notification error:', notifErr); }

    res.status(201).json({ success: true, data: pet });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────
// PUBLIC: Get approved + available pets  →  GET /api/pets
// ─────────────────────────────────────────────────────────────
exports.getPets = async (req, res) => {
  try {
    // Only show admin-approved listings to the public
    const filter = { status: 'available', adminApproval: 'approved' };

    if (req.query.breed)         filter.breed          = new RegExp(req.query.breed,  'i');
    if (req.query.gender)        filter.gender         = req.query.gender;
    if (req.query.size)          filter.size           = req.query.size;
    if (req.query.city)          filter['location.city'] = new RegExp(req.query.city, 'i');
    if (req.query.activityLevel) filter.activityLevel  = req.query.activityLevel;
    if (req.query.vaccinated)    filter.vaccinated     = req.query.vaccinated === 'true';
    if (req.query.goodWithKids)  filter.goodWithKids   = req.query.goodWithKids === 'true';
    // Generic search: match breed OR city
    if (req.query.search) {
      const rx = new RegExp(req.query.search, 'i');
      filter.$or = [{ breed: rx }, { 'location.city': rx }, { name: rx }];
    }

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
    const pet = await Pet.findById(req.params.id).populate('rehomer', 'name phone email location profileImage');
    if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });
    // Increment views silently — don't let a save failure block the response
    Pet.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).catch(() => {});
    res.status(200).json({ success: true, data: pet });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, error: 'Pet not found' });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────
// REHOMER: My listings  →  GET /api/pets/rehomer/my-listings
// ─────────────────────────────────────────────────────────────
exports.getMyListings = async (req, res) => {
  try {
    const pets = await Pet.find({ rehomer: req.user.id }).sort('-createdAt')
      .populate('applications.adopter', 'name email phone profileImage location address userType adoptionPreferences createdAt');

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



    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => `/uploads/pets/${file.filename}`);
      req.body.primaryImage = imageUrls[0];
      req.body.images = imageUrls;
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
// ADMIN: Get ALL pets (any approval status) → GET /api/pets/admin/all
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

    // Summary counts for admin dashboard stats
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

    // Send email notification to rehomer if approved
    if (adminApproval === 'approved') {
      try {
        const rehomer = await User.findById(pet.rehomer);
        if (rehomer && rehomer.email) {
          await sendEmail({
            email: rehomer.email,
            subject: emailTemplates.petApproval(pet.name, rehomer.name).subject,
            html: emailTemplates.petApproval(pet.name, rehomer.name).html,
          });
        }
      } catch (emailErr) {
        console.error('Failed to send pet approval email:', emailErr);
      }
    }

    // Create in-app notification for rehomer
    try {
      await Notification.create({
        recipient: pet.rehomer,
        type: 'system',
        title: adminApproval === 'approved' ? 'Listing Approved! 🎉' : 'Listing Update',
        message: adminApproval === 'approved' 
          ? `Your listing for ${pet.name} has been approved and is now live.`
          : `There is an update regarding your listing for ${pet.name}. Please check your dashboard.`,
        link: '/rehomer/dashboard?tab=my-dogs'
      });
    } catch (notifErr) { console.error('Rehomer notification error:', notifErr); }

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

    if (pet.adminApproval !== 'approved') {
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

    try {
      await Notification.create({
        recipient: pet.rehomer,
        type: 'adoption',
        title: 'New Application',
        message: `Someone has applied to adopt ${pet.name}.`,
        link: `/rehomer/dashboard?tab=applications`
      });
      
      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        await Notification.create({
          recipient: admin._id,
          type: 'system',
          title: 'New Adoption Application',
          message: `A new application has been submitted for ${pet.name}.`,
          link: `/admin/dashboard?tab=adoptions`
        });
      }
    } catch (err) { console.error('Notification err:', err); }

    res.status(200).json({ success: true, message: 'Application submitted', data: pet });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────
// ADOPTER: Initiate Khalti Payment  →  POST /api/pets/:id/apply/initiate
// ─────────────────────────────────────────────────────────────
exports.initiateKhaltiPayment = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });

    if (pet.adminApproval !== 'approved') {
      return res.status(400).json({ success: false, error: 'This pet is not available for adoption' });
    }

    const alreadyApplied = pet.applications.some(a => a.adopter.toString() === req.user.id);
    if (alreadyApplied) {
      return res.status(400).json({ success: false, error: 'You have already applied for this pet' });
    }

    // Amount calculation. If no rehomingFee, charge minimum 10 NPR for spam protection.
    let amountNPR = pet.rehomingFee || 10;
    let amountPaisa = amountNPR * 100;
    
    // Purchase Order details
    const purchase_order_id = `pet_${pet._id}_user_${req.user.id}`;
    const purchase_order_name = `Adoption Application: ${pet.name}`;
    const return_url = `${process.env.FRONTEND_URL}/payment/khalti/verify?petId=${pet._id}&message=${encodeURIComponent(req.body.message || '')}`;

    const khaltiPayload = {
        return_url,
        website_url: process.env.FRONTEND_URL,
        amount: amountPaisa,
        purchase_order_id,
        purchase_order_name,
        customer_info: {
            name: req.user.name || 'Adopter',
            email: req.user.email || 'adopter@example.com',
            phone: req.user.phone || '9800000000'
        }
    };

    const khaltiResponse = await axios.post(
        'https://a.khalti.com/api/v2/epayment/initiate/',
        khaltiPayload,
        {
            headers: {
                'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );

    if (khaltiResponse.data && khaltiResponse.data.payment_url) {
        // Create a pending payment record
        await Payment.create({
            pet: pet._id,
            adopter: req.user.id,
            rehomer: pet.rehomer,
            amount: amountNPR,
            currency: 'NPR',
            status: 'pending',
            pidx: khaltiResponse.data.pidx,
            message: req.body.message || '',
            paymentMethod: 'khalti'
        });

        res.status(200).json({ 
            success: true, 
            payment_url: khaltiResponse.data.payment_url,
            pidx: khaltiResponse.data.pidx
        });
    } else {
        res.status(500).json({ success: false, error: 'Failed to initiate Khalti payment' });
    }
  } catch (error) {
    console.error('Khalti initiate error:', error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, error: 'Server error while initiating payment' });
  }
};

// ─────────────────────────────────────────────────────────────
// ADOPTER: Verify Khalti Payment & Apply  →  POST /api/pets/:id/apply/verify
// ─────────────────────────────────────────────────────────────
exports.verifyKhaltiAndApply = async (req, res) => {
  try {
    const { pidx, message } = req.body;
    if (!pidx) return res.status(400).json({ success: false, error: 'Missing pidx' });

    // Verify payment status with Khalti
    const khaltiResponse = await axios.post(
        'https://a.khalti.com/api/v2/epayment/lookup/',
        { pidx },
        {
            headers: {
                'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );

    if (khaltiResponse.data && khaltiResponse.data.status === 'Completed') {
        // Find and update the payment record
        const payment = await Payment.findOneAndUpdate(
            { pidx },
            { 
                status: 'completed', 
                transactionId: khaltiResponse.data.transaction_id,
                paidAt: new Date()
            },
            { new: true }
        );

        const pet = await Pet.findById(req.params.id);
        if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });

        const alreadyApplied = pet.applications.some(a => a.adopter.toString() === req.user.id);
        if (alreadyApplied) {
            return res.status(400).json({ success: false, error: 'You have already applied for this pet' });
        }

        pet.applications.push({ 
            adopter: req.user.id, 
            message: message || '', 
            status: 'pending',
            paymentStatus: 'paid',
            paymentId: payment ? payment._id : null
        });
        pet.status = 'pending';
        await pet.save();

        await User.findByIdAndUpdate(req.user.id, {
          $push: { petsAdopted: { petId: pet._id, petName: pet.name, status: 'pending' } },
        });

        try {
          await Notification.create({
            recipient: pet.rehomer,
            type: 'adoption',
            title: 'New Application',
            message: `Someone has applied to adopt ${pet.name} (via Khalti).`,
            link: `/rehomer/dashboard?tab=applications`
          });
          
          const admins = await User.find({ role: 'admin' });
          for (const admin of admins) {
            await Notification.create({
              recipient: admin._id,
              type: 'system',
              title: 'New Adoption Application',
              message: `A new application has been submitted for ${pet.name} (via Khalti).`,
              link: `/admin/dashboard?tab=adoptions`
            });
          }
        } catch (err) { console.error('Notification err:', err); }

        res.status(200).json({ success: true, message: 'Application submitted successfully via Khalti', data: pet });
    } else {
        res.status(400).json({ success: false, error: 'Payment verification failed or payment not completed' });
    }
  } catch (error) {
    console.error('Khalti verify error:', error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, error: 'Server error while verifying payment' });
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
    const pet = await Pet.findById(req.params.id)
      .populate('applications.adopter', 'name email');
    if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });

    if (pet.rehomer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const application = pet.applications.id(req.params.appId);
    if (!application) return res.status(404).json({ success: false, error: 'Application not found' });

    application.status = status;

    // Collect adopters whose status changed to 'rejected' so we can email them
    const toNotifyRejected = [];

    if (status === 'approved') {
      pet.status      = 'adopted';
      pet.adoptedBy   = application.adopter._id || application.adopter;
      pet.adoptedDate = new Date();
      pet.applications.forEach(a => {
        if (a._id.toString() !== req.params.appId && a.status === 'pending') {
          a.status = 'rejected';
          if (a.adopter && a.adopter.email) toNotifyRejected.push(a.adopter);
        }
      });
    } else if (status === 'rejected') {
      // Revert pet status to available if there are no more active applications
      const hasActiveApps = pet.applications.some(a => a.status === 'pending' || a.status === 'approved');
      if (!hasActiveApps) {
        pet.status = 'available';
      }
    }

    await pet.save();

    // ── Send notification emails & in-app notifications ──────────────────────────────
    const adopter  = application.adopter;
    const petName  = pet.name;

    if (adopter && adopter.email) {
      if (status === 'approved') {
        const tmpl = emailTemplates.adoptionApproval(petName, adopter.name || 'Adopter');
        sendEmail({ email: adopter.email, ...tmpl }).catch(err => console.error('Approval email error:', err));

        try {
            await Notification.create({
                recipient: adopter._id || adopter,
                type: 'adoption',
                title: 'Application Approved! 🎉',
                message: `Your application for ${pet.name} has been approved!`,
                link: '/adopter/dashboard?tab=applications'
            });
        } catch(e) {}
      } else if (status === 'rejected') {
        const tmpl = emailTemplates.adoptionRejection(petName, adopter.name || 'Adopter');
        sendEmail({ email: adopter.email, ...tmpl }).catch(err => console.error('Rejection email error:', err));

        try {
            await Notification.create({
                recipient: adopter._id || adopter,
                type: 'adoption',
                title: 'Application Update',
                message: `Your application for ${pet.name} was not selected this time.`,
                link: '/adopter/dashboard?tab=applications'
            });
        } catch(e) {}
      }
    }

    // Also email auto-rejected adopters when someone else is approved
    toNotifyRejected.forEach(otherAdopter => {
      const tmpl = emailTemplates.adoptionRejection(petName, otherAdopter.name || 'Adopter');
      sendEmail({ email: otherAdopter.email, ...tmpl }).catch(err => console.error('Auto-rejection email error:', err));
      
      try {
          Notification.create({
              recipient: otherAdopter._id || otherAdopter,
              type: 'adoption',
              title: 'Application Update',
              message: `Your application for ${pet.name} was not selected this time.`,
              link: '/adopter/dashboard?tab=applications'
          }).catch(e => {});
      } catch(e) {}
    });

    try {
        const admins = await User.find({ role: 'admin' });
        for (const admin of admins) {
            await Notification.create({
                recipient: admin._id,
                type: 'system',
                title: 'Application Status Updated',
                message: `Application for ${pet.name} was ${status}.`,
                link: '/admin/dashboard?tab=adoptions'
            });
        }
    } catch(e) {}
    // ─────────────────────────────────────────────────────────────────────────

    res.status(200).json({ success: true, data: pet });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────
// REHOMER: Delete an application → DELETE /api/pets/:id/applications/:appId
// ─────────────────────────────────────────────────────────────
exports.deleteApplication = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });

    if (pet.rehomer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const applicationIndex = pet.applications.findIndex(a => a._id.toString() === req.params.appId);
    if (applicationIndex === -1) return res.status(404).json({ success: false, error: 'Application not found' });

    // Remove the application
    pet.applications.splice(applicationIndex, 1);
    
    // Check if the removed application was the one that adopted the pet
    // If so, we might want to revert the pet status to available, but usually deleting an app is for rejected or pending ones.
    // Let's just blindly delete it. If they delete an approved app, maybe pet goes back to available?
    if (pet.status === 'adopted') {
        const hasApprovedApp = pet.applications.some(a => a.status === 'approved');
        if (!hasApprovedApp) {
            pet.status = 'available';
            pet.adoptedBy = null;
            pet.adoptedDate = null;
        }
    }

    await pet.save();
    res.status(200).json({ success: true, message: 'Application deleted', data: pet });
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
// ─────────────────────────────────────────────────────────────
// ADMIN: Get ALL applications across all pets → GET /api/pets/admin/applications
// ─────────────────────────────────────────────────────────────
exports.adminGetAllApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter['applications.status'] = status;

    const pets = await Pet.find({ 'applications.0': { $exists: true } })
      .populate('rehomer', 'name email')
      .populate('applications.adopter', 'name email phone profileImage location')
      .sort('-createdAt');

    // Flatten all applications
    let allApplications = [];
    pets.forEach(pet => {
      pet.applications.forEach(app => {
        if (!status || app.status === status) {
          allApplications.push({
            _id:       app._id,
            status:    app.status,
            message:   app.message,
            appliedAt: app.appliedAt,
            adopter:   app.adopter,
            pet: {
              _id:          pet._id,
              name:         pet.name,
              breed:        pet.breed,
              primaryImage: pet.primaryImage,
              status:       pet.status,
            },
            rehomer: pet.rehomer,
          });
        }
      });
    });

    // Sort by newest first
    allApplications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    const total = allApplications.length;
    const paginated = allApplications.slice(skip, skip + parseInt(limit));

    res.status(200).json({ success: true, total, totalPages: Math.ceil(total / parseInt(limit)), data: paginated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────
// REHOMER: Get payment history for their pets → GET /api/pets/rehomer/payments
// ─────────────────────────────────────────────────────────────
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ rehomer: req.user.id })
      .populate('pet', 'name primaryImage breed')
      .populate('adopter', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────
// ADMIN: Get all payment history → GET /api/pets/admin/payments
// ─────────────────────────────────────────────────────────────
exports.adminGetPayments = async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate('pet', 'name primaryImage breed')
      .populate('adopter', 'name email phone')
      .populate('rehomer', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};