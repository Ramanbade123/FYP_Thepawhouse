const crypto = require('crypto');
const User = require('../models/User');
const { sendTokenResponse } = require('../utils/generateToken');
const validator = require('validator');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      password, 
      confirmPassword,
      role, 
      userType,
      address,
      // Adopter specific fields
      adoptionPreferences,
      // Rehomer specific fields
      rehomingInfo,
    } = req.body;

    // Validation
    const requiredFields = ['name', 'email', 'phone', 'password', 'confirmPassword'];
    
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          error: `Please provide ${field}`,
        });
      }
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email',
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match',
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long',
      });
    }

    // Validate phone number
    if (!validator.isMobilePhone(phone, 'any', { strictMode: false })) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid phone number',
      });
    }

    // Validate role
    const validRoles = ['adopter', 'rehomer', 'admin'];
    const userRole = role || 'adopter';
    
    if (!validRoles.includes(userRole)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user role. Must be either adopter or rehomer',
      });
    }

    // Validate userType if provided
    if (userType) {
      const validUserTypes = ['individual', 'family', 'organization', 'shelter'];
      if (!validUserTypes.includes(userType)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid user type',
        });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email',
      });
    }

    // Check if phone number exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        error: 'Phone number already registered',
      });
    }

    // For admin registration, require special code
    if (userRole === 'admin') {
      const adminCode = req.body.adminCode;
      if (!adminCode || adminCode !== process.env.ADMIN_REGISTRATION_CODE) {
        return res.status(403).json({
          success: false,
          error: 'Invalid admin registration code',
        });
      }
    }

    // Create user
    const userData = {
      name,
      email,
      phone,
      password,
      role: userRole,
      userType: userType || 'individual',
      address: address || {},
    };

    // Add role-specific data
    if (userRole === 'adopter' && adoptionPreferences) {
      userData.adoptionPreferences = {
        ...adoptionPreferences,
        // Set defaults if not provided
        activityLevel: adoptionPreferences.activityLevel || 'medium',
        houseType: adoptionPreferences.houseType || 'house',
      };
    }
    
    if (userRole === 'rehomer' && rehomingInfo) {
      userData.rehomingInfo = {
        ...rehomingInfo,
        // Set defaults if not provided
        urgency: rehomingInfo.urgency || 'medium',
        transitionPeriod: rehomingInfo.transitionPeriod || 'flexible',
      };
    }

    const user = await User.create(userData);

    // Send welcome email
    try {
      await sendEmail({
        email: user.email,
        subject: emailTemplates.welcome(user.name).subject,
        html: emailTemplates.welcome(user.name).html,
      });
    } catch (emailError) {
      console.error('Welcome email error:', emailError);
      // Don't fail registration if email fails
    }

    // Send token response
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error during registration',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated. Please contact support.',
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login',
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email address',
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      // For security, don't reveal that user doesn't exist
      return res.status(200).json({
        success: true,
        message: 'If an account exists, a reset email will be sent',
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {
      // Send email
      await sendEmail({
        email: user.email,
        subject: emailTemplates.passwordReset(resetUrl).subject,
        html: emailTemplates.passwordReset(resetUrl).html,
      });

      res.status(200).json({
        success: true,
        message: 'Password reset email sent',
      });
    } catch (error) {
      console.error('Email send error:', error);
      
      // Clear token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        error: 'Email could not be sent',
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide password and confirm password',
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match',
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long',
      });
    }

    // Find user by token and check expiration
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token',
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send confirmation email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Successful - The Paw House',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(to right, #008737, #085558); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2>Hello ${user.name},</h2>
              <p>Your password has been successfully reset.</p>
              <p>If you did not request this change, please contact our support team immediately.</p>
              <p>For security reasons, we recommend that you:</p>
              <ul>
                <li>Use a strong, unique password</li>
                <li>Enable two-factor authentication if available</li>
                <li>Regularly update your password</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/login" style="background: #008737; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Login to Your Account
                </a>
              </div>
              <p>Best regards,<br>The Paw House Team 🐾</p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Confirmation email error:', emailError);
      // Don't fail the reset if email fails
    }

    // Send token response (auto-login)
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      userType: req.body.userType,
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    // If phone is being updated, check for duplicates
    if (fieldsToUpdate.phone) {
      const existingPhone = await User.findOne({ 
        phone: fieldsToUpdate.phone,
        _id: { $ne: req.user.id }
      });
      
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          error: 'Phone number already in use',
        });
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
      select: '-password',
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Update details error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide current password, new password and confirm password',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'New passwords do not match',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 8 characters long',
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect',
      });
    }

    // Check if new password is same as current
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        error: 'New password must be different from current password',
      });
    }

    user.password = newPassword;
    await user.save();

    // Send confirmation email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Updated Successfully - The Paw House',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(to right, #008737, #085558); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Password Updated</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2>Hello ${user.name},</h2>
              <p>Your password has been successfully updated.</p>
              <p>If you did not make this change, please contact our support team immediately.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #008737; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Go to Dashboard
                </a>
              </div>
              <p>Best regards,<br>The Paw House Team 🐾</p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Password update email error:', emailError);
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};