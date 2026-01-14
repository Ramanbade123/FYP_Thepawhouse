const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('favorites', 'name breed age image');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name',
      'phone',
      'address',
      'userType',
      'profileImage'
    ];

    // Filter allowed fields
    const fieldsToUpdate = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        fieldsToUpdate[key] = req.body[key];
      }
    });

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

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true,
        select: '-password'
      }
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Update user preferences/info based on role
// @route   PUT /api/users/preferences/:type
// @access  Private
exports.updatePreferences = async (req, res) => {
  try {
    const { type } = req.params;
    const user = await User.findById(req.user.id);

    if (type === 'adoption' && user.role === 'adopter') {
      user.adoptionPreferences = {
        ...user.adoptionPreferences,
        ...req.body
      };
    } else if (type === 'rehoming' && user.role === 'rehomer') {
      user.rehomingInfo = {
        ...user.rehomingInfo,
        ...req.body
      };
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid preference type for user role',
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Get dashboard statistics based on role
// @route   GET /api/users/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    let stats = {
      role: user.role,
      displayRole: user.displayRole,
      userSince: user.createdAt,
      lastLogin: user.lastLogin,
      loginCount: user.loginCount,
    };

    // Role-specific stats
    if (user.role === 'adopter') {
      stats.adoptedPets = user.petsAdopted.length;
      stats.favoritePets = user.favorites.length;
      stats.preferences = user.adoptionPreferences;
    } else if (user.role === 'rehomer') {
      stats.rehomedPets = user.petsRehomed.length;
      stats.rehomingInfo = user.rehomingInfo;
    } else if (user.role === 'admin') {
      // Admin stats
      const totalUsers = await User.countDocuments();
      const totalAdopters = await User.countDocuments({ role: 'adopter' });
      const totalRehomers = await User.countDocuments({ role: 'rehomer' });
      
      stats.totalUsers = totalUsers;
      stats.totalAdopters = totalAdopters;
      stats.totalRehomers = totalRehomers;
      stats.totalAdmins = await User.countDocuments({ role: 'admin' });
      
      // Recent activity
      const recentUsers = await User.find()
        .sort('-createdAt')
        .limit(5)
        .select('name email role createdAt');
      
      stats.recentUsers = recentUsers;
    }

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'role'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Filter by role if provided
    if (req.query.role) {
      queryObj.role = req.query.role;
    }

    let query = User.find(queryObj).select('-password');

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    query = query.skip(skip).limit(limit);

    // Execute query
    const users = await query;

    // Get total count for pagination
    const total = await User.countDocuments(queryObj);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: users,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Get single user (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    // Don't allow password update through this route
    if (req.body.password) {
      delete req.body.password;
    }

    // Don't allow role changes to admin without proper authorization
    if (req.body.role === 'admin') {
      const adminCode = req.body.adminCode;
      if (!adminCode || adminCode !== process.env.ADMIN_REGISTRATION_CODE) {
        return res.status(403).json({
          success: false,
          error: 'Admin code required to assign admin role',
        });
      }
      delete req.body.adminCode;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
        select: '-password'
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Don't allow self-deletion
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own account',
      });
    }

    // Don't allow deletion of last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete the last admin account',
        });
      }
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};