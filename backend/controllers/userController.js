import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
import AuditLog from '../models/auditLogModel.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      isAdmin: user.isAdmin,
      isFarmer: user.isFarmer,
      isSupplier: user.isSupplier,
      isVerified: user.isVerified,
      govtId: user.govtId,
      token: generateToken(user._id),
      farmDetails: user.farmDetails,
      address: user.address,
      image: user.image,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, mobile, password, govtId, isSupplier, isAdmin, adminSecret } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Logic for Admin registration
  let isAdminRole = false;
  if (isAdmin) {
    if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
      res.status(401);
      throw new Error('Invalid Admin Secret Key');
    }
    isAdminRole = true;
  }

  // Logic for Farmer/Supplier/User
  // If isSupplier is true, mark as supplier.
  // Else if govtId is provided, mark as farmer.
  // Else regular user.
  
  const isFarmerRole = !isSupplier && !isAdminRole && govtId ? true : false;
  const isSupplierRole = isSupplier && !isAdminRole ? true : false;
  const isVerified = isAdminRole ? true : false; // Admins are auto-verified 

  const user = await User.create({
    name,
    email,
    mobile,
    password,
    govtId: isAdminRole ? null : govtId,
    isAdmin: isAdminRole,
    isFarmer: isFarmerRole,
    isSupplier: isSupplierRole,
    isVerified
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      isAdmin: user.isAdmin,
      isFarmer: user.isFarmer,
      isSupplier: user.isSupplier,
      isVerified: user.isVerified,
      govtId: user.govtId,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      isAdmin: user.isAdmin,
      farmDetails: user.farmDetails,
      address: user.address,
      image: user.image,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.mobile = req.body.mobile || user.mobile;
    user.farmDetails = req.body.farmDetails || user.farmDetails;
    user.address = req.body.address || user.address;
    
    // Check if image is present in request body (even if empty string)
    if (req.body.image !== undefined) {
      user.image = req.body.image;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      isAdmin: updatedUser.isAdmin,
      isFarmer: updatedUser.isFarmer,
      isSupplier: updatedUser.isSupplier,
      isVerified: updatedUser.isVerified,
      govtId: updatedUser.govtId,
      token: generateToken(updatedUser._id),
      farmDetails: updatedUser.farmDetails,
      address: updatedUser.address,
      image: updatedUser.image,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  
  const maskedUsers = users.map(user => {
    const userObj = user.toObject();
    if (userObj.govtId && userObj.govtId.length > 4) {
      userObj.govtId = 'XXXX-XXXX-' + userObj.govtId.slice(-4);
    } else if (userObj.govtId) {
      userObj.govtId = 'XXXX';
    }
    return userObj;
  });
  
  res.json(maskedUsers);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    const userObj = user.toObject();
    // Mask sensitive data (govtId) - show only last 4 digits
    if (userObj.govtId && userObj.govtId.length > 4) {
      userObj.govtId = 'XXXX-XXXX-' + userObj.govtId.slice(-4);
    } else if (userObj.govtId) {
      userObj.govtId = 'XXXX';
    }
    res.json(userObj);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Unmask user sensitive data
// @route   POST /api/users/unmask-id
// @access  Private/Staff
const unmaskUserField = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const user = await User.findById(id);

  if (user) {
    // Log access
    await AuditLog.create({
      viewerId: req.user._id,
      targetUserId: user._id,
      action: 'UNMASKED_ID',
      metadata: { 
        ip: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    res.json({ govtId: user.govtId });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);
    user.isFarmer = Boolean(req.body.isFarmer);
    user.isVerified = Boolean(req.body.isVerified);
    user.govtId = req.body.govtId || user.govtId;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isFarmer: updatedUser.isFarmer,
      isVerified: updatedUser.isVerified,
      govtId: updatedUser.govtId,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all audit logs
// @route   GET /api/users/audit-logs
// @access  Private/Admin
const getAuditLogs = asyncHandler(async (req, res) => {
  const logs = await AuditLog.find({})
    .populate('viewerId', 'name email')
    .populate('targetUserId', 'name email')
    .sort({ createdAt: -1 });
  res.json(logs);
});

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  unmaskUserField,
  getAuditLogs,
};
