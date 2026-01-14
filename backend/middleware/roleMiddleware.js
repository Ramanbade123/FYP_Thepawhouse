// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Admin only.',
    });
  }
  next();
};

// Check if user is adopter
const isAdopter = (req, res, next) => {
  if (!req.user || req.user.role !== 'adopter') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Adopters only.',
    });
  }
  next();
};

// Check if user is rehomer
const isRehomer = (req, res, next) => {
  if (!req.user || req.user.role !== 'rehomer') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Rehomers only.',
    });
  }
  next();
};

// Check if user is either adopter or rehomer
const isUser = (req, res, next) => {
  if (!req.user || !['adopter', 'rehomer'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Users only.',
    });
  }
  next();
};

// Check if user can access specific user data
const canAccessUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'User not authenticated',
    });
  }

  // Admins can access all users
  if (req.user.role === 'admin') {
    return next();
  }

  // Users can only access their own data
  if (req.params.id && req.params.id !== req.user.id.toString()) {
    return res.status(403).json({
      success: false,
      error: 'Access denied. You can only access your own data.',
    });
  }

  next();
};

module.exports = {
  authorize,
  isAdmin,
  isAdopter,
  isRehomer,
  isUser,
  canAccessUser,
};