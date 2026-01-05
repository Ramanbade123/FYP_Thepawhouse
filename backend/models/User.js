const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

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
        min: Number,
        max: Number,
      },
      houseType: {
        type: String,
        enum: ['apartment', 'house', 'farm', 'other'],
      },
      hasYard: Boolean,
      hasOtherPets: Boolean,
      hasChildren: Boolean,
      activityLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
      },
    },
    // Additional fields for rehomers
    rehomingInfo: {
      reason: String,
      urgency: {
        type: String,
        enum: ['low', 'medium', 'high', 'emergency'],
      },
      canFoster: Boolean,
      transitionPeriod: {
        type: String,
        enum: ['immediate', '1-2 weeks', '2-4 weeks', 'flexible'],
      },
    },
    // Track user activity
    petsAdopted: [{
      petId: mongoose.Schema.Types.ObjectId,
      petName: String,
      adoptedDate: Date,
    }],
    petsRehomed: [{
      petId: mongoose.Schema.Types.ObjectId,
      petName: String,
      rehomedDate: Date,
    }],
    favorites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
    }],
    profileImage: {
      type: String,
      default: 'default-profile.jpg',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationDocuments: [{
      type: String,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    loginCount: {
      type: Number,
      default: 0,
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
userSchema.index({ role: 1 });
userSchema.index({ 'address.city': 1 });
userSchema.index({ createdAt: -1 });

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
});

// Increment login count
userSchema.methods.incrementLoginCount = async function() {
  this.loginCount += 1;
  this.lastLogin = new Date();
  await this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;