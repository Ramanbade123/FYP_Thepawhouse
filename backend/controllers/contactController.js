const ContactMessage = require('../models/ContactMessage');

// POST /api/contact — public, anyone can send
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }
    const msg = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ success: true, data: msg });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/contact — admin only
exports.getMessages = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const total = await ContactMessage.countDocuments(filter);
    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    res.status(200).json({ success: true, total, pages: Math.ceil(total / limit), data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/contact/:id/status — admin only
exports.updateStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(adminNote !== undefined && { adminNote }) },
      { new: true }
    );
    if (!msg) return res.status(404).json({ success: false, error: 'Message not found' });
    res.status(200).json({ success: true, data: msg });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /api/contact/:id — admin only
exports.deleteMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ success: false, error: 'Message not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};