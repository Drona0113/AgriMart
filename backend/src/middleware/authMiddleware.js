import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        res.status(401);
        return res.json({ message: 'Not authorized, user not found' });
      }

      return next();
    } catch (error) {
      console.error(error);
      res.status(401);
      return res.json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401);
    return res.json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

const farmer = (req, res, next) => {
  if (req.user && (req.user.isFarmer || req.user.isSupplier || req.user.isAdmin)) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as a seller');
  }
};

const checkStaffRole = (req, res, next) => {
  if (req.user && (req.user.role === 'secretariat_staff' || req.user.isAdmin)) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as Secretariat Staff');
  }
};

export { protect, admin, farmer, checkStaffRole };
