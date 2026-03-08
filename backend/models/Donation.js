const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donorName:  { type: String, required: true },
    donorEmail: { type: String, default: '' },
    donorPhone: { type: String, default: '' },
    amount:     { type: Number, required: true, min: 1 },
    currency:   { type: String, default: 'NPR' },
    message:    { type: String, maxlength: 500, default: '' },
    anonymous:  { type: Boolean, default: false },

    // What is the donation for
    purpose: {
      type: String,
      enum: ['general', 'medical', 'food', 'shelter', 'vaccination', 'rescue'],
      default: 'general',
    },

    // Payment
    paymentMethod: {
      type: String,
      enum: ['esewa', 'khalti', 'bank-transfer', 'cash', 'other'],
      default: 'other',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    transactionId: { type: String, default: '' },

    // Linked user if logged in
    donatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

donationSchema.index({ paymentStatus: 1 });
donationSchema.index({ createdAt: -1 });

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;