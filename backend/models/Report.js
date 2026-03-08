const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['abuse', 'neglect', 'abandonment', 'health-hazard', 'illegal-breeding', 'other'],
      required: [true, 'Please select a category'],
    },
    title:       { type: String, required: [true, 'Please provide a title'], maxlength: 100 },
    description: { type: String, required: [true, 'Please describe the incident'], maxlength: 1500 },
    photo:       { type: String, default: '' },

    location: {
      area:    { type: String, required: [true, 'Please provide the location area'] },
      city:    { type: String, default: 'Kathmandu' },
      details: { type: String, default: '' },
    },

    // Who is being reported (optional)
    suspectDescription: { type: String, maxlength: 500, default: '' },

    // Reporter contact
    reporterName:  { type: String, required: [true, 'Please provide your name'] },
    reporterPhone: { type: String, default: '' },
    reporterEmail: { type: String, default: '' },
    anonymous:     { type: Boolean, default: false },

    // Logged-in user who submitted
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // Admin handling
    status: {
      type: String,
      enum: ['pending', 'under-review', 'resolved', 'dismissed'],
      default: 'pending',
    },
    adminNote:    { type: String, default: '' },
    resolvedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    resolvedAt:   { type: Date, default: null },

    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
  },
  { timestamps: true }
);

reportSchema.index({ status: 1 });
reportSchema.index({ category: 1 });
reportSchema.index({ createdAt: -1 });

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;