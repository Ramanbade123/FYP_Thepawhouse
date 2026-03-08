const Report = require('../models/Report');
const path   = require('path');
const fs     = require('fs');
const multer = require('multer');

// ── Multer ──────────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'reports');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    cb(null, `report_${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
exports.uploadPhoto = upload.single('photo');

// GET all reports — admin only
exports.getReports = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status)   filter.status   = status;
    if (category) filter.category = category;

    const skip    = (Number(page) - 1) * Number(limit);
    const total   = await Report.countDocuments(filter);
    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('reportedBy', 'name email');

    res.status(200).json({ success: true, total, data: reports });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET single report — admin only
exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('reportedBy', 'name email');
    if (!report) return res.status(404).json({ success: false, error: 'Report not found' });
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// CREATE report — public (optionalAuth)
exports.createReport = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file)  body.photo      = `/uploads/reports/${req.file.filename}`;
    if (req.user)  body.reportedBy = req.user._id;

    if (body.location && typeof body.location === 'string') {
      try { body.location = JSON.parse(body.location); } catch (_) {}
    }

    const report = await Report.create(body);
    res.status(201).json({ success: true, data: report });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// UPDATE status — admin only
exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!report) return res.status(404).json({ success: false, error: 'Report not found' });
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// DELETE — admin only
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, error: 'Report not found' });
    if (report.photo) {
      const p = path.join(__dirname, '..', report.photo);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
    await report.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};