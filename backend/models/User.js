const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      validate: {
        validator: function(v) {
          return /^[0-9]{10,15}$/.test(v);
        },
        message: 'Please provide a valid phone number',
      },
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['adopter', 'rehomer', 'admin'],
      default: 'adopter',
    },
    userType: {
      type: String,
      enum: ['individual', 'family', 'organization', 'shelter'],
      default: 'individual',
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'Nepal',
      },
    },
    // Additional fields for adopters
    adoptionPreferences: {
      preferredBreeds: [String],
      preferredAge: {
        min: { type: Number, min: 0, max: 30, default: 0 },
        max: { type: Number, min: 0, max: 30, default: 15 },
      },
      houseType: {
        type: String,
        enum: ['apartment', 'house', 'farm', 'other'],
        default: 'house',
      },
      hasYard: { type: Boolean, default: false },
      hasOtherPets: { type: Boolean, default: false },
      hasChildren: { type: Boolean, default: false },
      childrenAges: [String],
      activityLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
      },
      preferredGender: {
        type: String,
        enum: ['male', 'female', 'any'],
        default: 'any',
      },
      budgetRange: {
        min: { type: Number, min: 0, default: 0 },
        max: { type: Number, min: 0, default: 10000 },
      },
      experienceLevel: {
        type: String,
        enum: ['first-time', 'experienced', 'expert'],
        default: 'first-time',
      },
    },
    // Additional fields for rehomers
    rehomingInfo: {
      reason: String,
      urgency: {
        type: String,
        enum: ['low', 'medium', 'high', 'emergency'],
        default: 'medium',
      },
      canFoster: { type: Boolean, default: false },
      transitionPeriod: {
        type: String,
        enum: ['immediate', '1-2 weeks', '2-4 weeks', 'flexible'],
        default: 'flexible',
      },
      medicalHistoryProvided: { type: Boolean, default: false },
      vaccinationStatus: {
        type: String,
        enum: ['up-to-date', 'partial', 'none'],
        default: 'up-to-date',
      },
      behavioralNotes: String,
      specialNeeds: String,
      rehomingFee: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
    // Track user activity
    petsAdopted: [{
      petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
      },
      petName: String,
      adoptedDate: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ['pending', 'approved', 'completed', 'cancelled'],
        default: 'pending',
      },
    }],
    petsRehomed: [{
      petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
      },
      petName: String,
      rehomedDate: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ['pending', 'approved', 'completed', 'cancelled'],
        default: 'pending',
      },
    }],
    favorites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
    }],
    profileImage: {
      type: String,
      default: 'default-profile.jpg',
    },
    // Password reset fields
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    // Verification fields
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationDocuments: [{
      type: String,
    }],
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verificationNotes: String,
    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
    deactivationReason: String,
    // Login tracking
    lastLogin: Date,
    loginCount: {
      type: Number,
      default: 0,
    },
    // Preferences
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    smsNotifications: {
      type: Boolean,
      default: true,
    },
    privacySettings: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'connections-only'],
        default: 'private',
      },
      showContactInfo: {
        type: Boolean,
        default: false,
      },
      showLocation: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'address.city': 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ isVerified: 1 });
userSchema.index({ isActive: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Check if reset token is valid
userSchema.methods.isResetTokenValid = function() {
  return this.resetPasswordExpire > Date.now();
};

// Clear reset token
userSchema.methods.clearResetToken = function() {
  this.resetPasswordToken = undefined;
  this.resetPasswordExpire = undefined;
  return this.save({ validateBeforeSave: false });
};

// Method to check if user has specific role
userSchema.methods.hasRole = function(role) {
  return this.role === role;
};

// Method to check if user has any of the given roles
userSchema.methods.hasAnyRole = function(roles) {
  return roles.includes(this.role);
};

// Virtual for user type display
userSchema.virtual('displayRole').get(function() {
  const roleMap = {
    'adopter': 'Adopter',
    'rehomer': 'Rehomer',
    'admin': 'Administrator'
  };
  return roleMap[this.role] || 'User';
});  // FIXED: Added missing closing parenthesis and semicolon

// Virtual for full address
userSchema.virtual('fullAddress').get(function() {
  const parts = [];
  if (this.address.street) parts.push(this.address.street);
  if (this.address.city) parts.push(this.address.city);
  if (this.address.state) parts.push(this.address.state);
  if (this.address.zipCode) parts.push(this.address.zipCode);
  if (this.address.country) parts.push(this.address.country);
  return parts.join(', ');
});

// Increment login count
userSchema.methods.incrementLoginCount = async function() {
  this.loginCount += 1;
  this.lastLogin = new Date();
  await this.save({ validateBeforeSave: false });
};

// Method to toggle account status
userSchema.methods.toggleAccountStatus = async function(reason) {
  this.isActive = !this.isActive;
  this.deactivationReason = reason || null;
  return await this.save();
};

// Method to add favorite pet
userSchema.methods.addFavorite = async function(petId) {
  if (!this.favorites.includes(petId)) {
    this.favorites.push(petId);
    return await this.save();
  }
  return this;
};

// Method to remove favorite pet
userSchema.methods.removeFavorite = async function(petId) {
  this.favorites = this.favorites.filter(id => id.toString() !== petId.toString());
  return await this.save();
};

// Method to check if pet is favorited
userSchema.methods.hasFavorite = function(petId) {
  return this.favorites.some(id => id.toString() === petId.toString());
};

// Static method to find users by location
userSchema.statics.findByLocation = function(city, state) {
  return this.find({
    $or: [
      { 'address.city': new RegExp(city, 'i') },
      { 'address.state': new RegExp(state, 'i') }
    ]
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;