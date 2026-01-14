const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  });
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

// Send token and create cookie
const sendTokenResponse = (user, statusCode, res) => {
  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  // Refresh token cookie options
  const refreshCookieOptions = {
    ...cookieOptions,
    expires: new Date(
      Date.now() + (process.env.JWT_REFRESH_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
    ),
  };

  // Remove password from output
  user.password = undefined;

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .cookie('refreshToken', refreshToken, refreshCookieOptions)
    .json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        displayRole: user.displayRole,
        userType: user.userType,
        profileImage: user.profileImage,
        address: user.address,
        isVerified: user.isVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        // Include role-specific data
        ...(user.role === 'adopter' && {
          adoptionPreferences: user.adoptionPreferences,
        }),
        ...(user.role === 'rehomer' && {
          rehomingInfo: user.rehomingInfo,
        }),
      },
    });
};

// Refresh token endpoint handler
const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      error: 'No refresh token provided',
    });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
      });
    }

    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'User not found or account inactive',
      });
    }

    // Generate new tokens
    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Set cookies
    const cookieOptions = {
      expires: new Date(
        Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    res
      .cookie('token', newToken, cookieOptions)
      .cookie('refreshToken', newRefreshToken, {
        ...cookieOptions,
        expires: new Date(
          Date.now() + (process.env.JWT_REFRESH_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
        ),
      })
      .json({
        success: true,
        token: newToken,
        refreshToken: newRefreshToken,
      });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  sendTokenResponse,
  refreshToken,
};