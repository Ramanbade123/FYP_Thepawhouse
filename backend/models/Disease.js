const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['viral', 'bacterial', 'parasitic', 'fungal', 'nutritional', 'genetic', 'other'],
      default: 'other',
    },
    affectedArea: { type: String, default: '' }, // e.g. "Skin", "Respiratory", "Digestive"
    symptoms:     [{ type: String }],
    causes:       [{ type: String }],
    prevention:   [{ type: String }],
    treatment:    { type: String, maxlength: 1000, default: '' },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'fatal'],
      default: 'moderate',
    },
    isContagious:    { type: Boolean, default: false },
    zoonoticRisk:    { type: Boolean, default: false }, // can spread to humans
    commonInNepal:   { type: Boolean, default: false },
    image:           { type: String, default: '' },
    addedBy:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

diseaseSchema.index({ name: 1 });
diseaseSchema.index({ category: 1 });
diseaseSchema.index({ commonInNepal: 1 });

const Disease = mongoose.model('Disease', diseaseSchema);
module.exports = Disease;