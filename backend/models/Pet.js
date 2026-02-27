const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for your dog'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    breed:       { type: String, required: [true, 'Please provide the breed'], trim: true },
    age: {
      value: { type: Number, required: true, min: 0, max: 30 },
      unit:  { type: String, enum: ['months', 'years'], default: 'years' },
    },
    gender:      { type: String, enum: ['male', 'female'], required: true },
    size:        { type: String, enum: ['small', 'medium', 'large', 'extra-large'], default: 'medium' },
    color:       { type: String, trim: true },
    description: { type: String, required: [true, 'Please provide a description'], maxlength: [1000] },

    // Health
    vaccinated:   { type: Boolean, default: false },
    neutered:     { type: Boolean, default: false },
    microchipped: { type: Boolean, default: false },
    healthNotes:  { type: String, maxlength: 500 },

    // Personality
    goodWithKids:  { type: Boolean, default: false },
    goodWithDogs:  { type: Boolean, default: false },
    goodWithCats:  { type: Boolean, default: false },
    activityLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    temperament:   [String],

    // Rehoming
    reason:      { type: String, maxlength: 500 },
    rehomingFee: { type: Number, min: 0, default: 0 },
    urgency:     { type: String, enum: ['low', 'medium', 'high', 'emergency'], default: 'medium' },

    // Images
    images:       [{ type: String }],
    primaryImage: { type: String, default: '' },

    // Listing status (rehomer controls)
    status: {
      type: String,
      enum: ['available', 'pending', 'adopted', 'inactive'],
      default: 'available',
    },

    // ── ADMIN APPROVAL ─────────────────────────────────────────
    adminApproval: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',  // listings go live immediately, admin can remove if needed
    },
    adminNote:  { type: String, maxlength: 500, default: '' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    approvedAt: { type: Date, default: null },

    // Location
    location: {
      city:    { type: String, trim: true },
      state:   { type: String, trim: true },
      country: { type: String, default: 'Nepal' },
    },

    // Ownership
    rehomer:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    adoptedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    adoptedDate: { type: Date },

    // Applications
    applications: [{
      adopter:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status:    { type: String, enum: ['pending', 'reviewing', 'approved', 'rejected'], default: 'pending' },
      message:   { type: String, maxlength: 500 },
      appliedAt: { type: Date, default: Date.now },
    }],

    favoritesCount: { type: Number, default: 0 },
    views:          { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

petSchema.index({ rehomer: 1 });
petSchema.index({ status: 1 });
petSchema.index({ adminApproval: 1 });
petSchema.index({ 'location.city': 1 });
petSchema.index({ createdAt: -1 });

petSchema.virtual('ageDisplay').get(function () {
  return `${this.age.value} ${this.age.unit}`;
});

const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;