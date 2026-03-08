const Disease = require('../models/Disease');

// GET all diseases — public
exports.getDiseases = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search)   filter.name     = new RegExp(search, 'i');

    const diseases = await Disease.find(filter).sort({ name: 1 });
    res.status(200).json({ success: true, count: diseases.length, data: diseases });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET single disease — public
exports.getDisease = async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id);
    if (!disease) return res.status(404).json({ success: false, error: 'Disease not found' });
    res.status(200).json({ success: true, data: disease });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// CREATE — admin only
exports.createDisease = async (req, res) => {
  try {
    req.body.addedBy = req.user._id;
    // Parse array fields sent as JSON strings
    ['symptoms', 'causes', 'prevention'].forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        try { req.body[field] = JSON.parse(req.body[field]); } catch (_) {
          req.body[field] = req.body[field].split(',').map(s => s.trim());
        }
      }
    });
    const disease = await Disease.create(req.body);
    res.status(201).json({ success: true, data: disease });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// UPDATE — admin only
exports.updateDisease = async (req, res) => {
  try {
    ['symptoms', 'causes', 'prevention'].forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        try { req.body[field] = JSON.parse(req.body[field]); } catch (_) {
          req.body[field] = req.body[field].split(',').map(s => s.trim());
        }
      }
    });
    const disease = await Disease.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!disease) return res.status(404).json({ success: false, error: 'Disease not found' });
    res.status(200).json({ success: true, data: disease });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// DELETE — admin only
exports.deleteDisease = async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id);
    if (!disease) return res.status(404).json({ success: false, error: 'Disease not found' });
    await disease.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};