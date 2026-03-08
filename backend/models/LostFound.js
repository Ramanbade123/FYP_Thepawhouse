const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['lost', 'found'],
      required: [true, 'Please specify if this is a lost or found report'],
    },

    // Dog details
    dogName:     { type: String, trim: true, default: '' },
    breed:       { type: String, trim: true, default: 'Unknown' },
    color:       { type: String, trim: true, required: [true, 'Please describe the dog colour'] },
    size:        { type: String, enum: ['small', 'medium', 'large', 'extra-large'], default: 'medium' },
    gender:      { type: String, enum: ['male', 'female', 'unknown'], default: 'unknown' },
    description: { type: String, maxlength: 800, default: '' },
    photo:       { type: String, default: '' },

    // Where & when
    location: {
      area:    { type: String, trim: true, required: [true, 'Please provide the area/neighbourhood'] },
      city:    { type: String, trim: true, default: 'Kathmandu' },
      details: { type: String, trim: true, default: '' }, // "Near the park on ring road"
    },
    date: { type: Date, required: [true, 'Please provide the date lost/found'] },

    // Contact
    contactName:  { type: String, trim: true, required: [true, 'Please provide a contact name'] },
    contactPhone: { type: String, trim: true, required: [true, 'Please provide a contact number'] },
    contactEmail: { type: String, trim: true, default: '' },

    // Status
    status: {
      type: String,
      enum: ['active', 'resolved'],
      default: 'active',
    },

    // Who posted it (optional — guests can post too via contact info)
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

lostFoundSchema.index({ type: 1 });
lostFoundSchema.index({ status: 1 });
lostFoundSchema.index({ 'location.city': 1 });
lostFoundSchema.index({ createdAt: -1 });

const LostFound = mongoose.model('LostFound', lostFoundSchema);
module.exports = LostFound;