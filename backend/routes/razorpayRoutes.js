import express from 'express';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayKey,
} from '../controllers/razorpayController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/order').post(protect, createRazorpayOrder);
router.route('/verify').post(protect, verifyRazorpayPayment);
router.get('/key', getRazorpayKey);

export default router;
