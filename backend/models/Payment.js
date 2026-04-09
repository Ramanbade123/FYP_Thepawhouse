const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
    },
    adopter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rehomer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'NPR',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    pidx: {
      type: String,
      unique: true,
      sparse: true,
    },
    transactionId: {
      type: String,
    },
    paymentMethod: {
      type: String,
      default: 'khalti',
    },
    message: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ pet: 1 });
paymentSchema.index({ adopter: 1 });
paymentSchema.index({ rehomer: 1 });
paymentSchema.index({ pidx: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
