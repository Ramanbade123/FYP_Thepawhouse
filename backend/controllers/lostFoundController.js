const LostFound = require('../models/LostFound');
const path      = require('path');
const fs        = require('fs');
const multer    = require('multer');

// ── Multer setup for lost/found photos ─────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'lostfound');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `lostfound_${Date.now()}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ok = allowed.test(path.extname(file.originalname).toLowerCase())
          && allowed.test(file.mimetype);
  ok ? cb(null, true) : cb(new Error('Only image files are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
exports.uploadPhoto = upload.single('photo');

// ── GET all reports (public) ────────────────────────────────────────────────
// GET /api/lostfound?type=lost&city=Kathmandu&status=active
exports.getReports = async (req, res) => {
  try {
    const { type, city, status = 'active', page = 1, limit = 12 } = req.query;

    const filter = {};
    if (type)   filter.type            = type;
    if (city)   filter['location.city'] = new RegExp(city, 'i');
    if (status) filter.status          = status;

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await LostFound.countDocuments(filter);
    const reports = await LostFound.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('reportedBy', 'name');

    res.status(200).json({
      success: true,
      count: reports.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      data: reports,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET single report (public) ──────────────────────────────────────────────
exports.getReport = async (req, res) => {
  try {
    const report = await LostFound.findById(req.params.id).populate('reportedBy', 'name email');
    if (!report) return res.status(404).json({ success: false, error: 'Report not found' });
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── CREATE report (any logged-in user OR guest) ─────────────────────────────
exports.createReport = async (req, res) => {
  try {
    const body = { ...req.body };

    // Attach uploaded photo path if present
    if (req.file) {
      body.photo = `/uploads/lostfound/${req.file.filename}`;
    }

    // Attach logged-in user if available
    if (req.user) {
      body.reportedBy = req.user._id;
    }

    // Parse location if sent as JSON string (FormData)
    if (body.location && typeof body.location === 'string') {
      try { body.location = JSON.parse(body.location); } catch (_) {}
    }

    const report = await LostFound.create(body);
    res.status(201).json({ success: true, data: report });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ── UPDATE report — owner or admin only ────────────────────────────────────
exports.updateReport = async (req, res) => {
  try {
    let report = await LostFound.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, error: 'Report not found' });

    // Only the poster or an admin can update
    const isOwner = report.reportedBy && report.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, error: 'Not authorised to update this report' });
    }

    if (req.file) {
      // Delete old photo
      if (report.photo) {
        const oldPath = path.join(__dirname, '..', report.photo);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      req.body.photo = `/uploads/lostfound/${req.file.filename}`;
    }

    report = await LostFound.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: report });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ── MARK AS RESOLVED ────────────────────────────────────────────────────────
exports.resolveReport = async (req, res) => {
  try {
    const report = await LostFound.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, error: 'Report not found' });

    const isOwner = report.reportedBy && report.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, error: 'Not authorised' });
    }

    report.status = 'resolved';
    await report.save();

    res.status(200).json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── DELETE report — owner or admin ─────────────────────────────────────────
exports.deleteReport = async (req, res) => {
  try {
    const report = await LostFound.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, error: 'Report not found' });

    const isOwner = report.reportedBy && report.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, error: 'Not authorised to delete this report' });
    }

    // Delete photo file
    if (report.photo) {
      const filePath = path.join(__dirname, '..', report.photo);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await report.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};