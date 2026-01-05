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

module.exports = {
  authorize,
  isAdmin,
  isAdopter,
  isRehomer,
  isUser,
};