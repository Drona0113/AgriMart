import Razorpay from 'razorpay';
import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

// @desc    Create Razorpay Order
// @route   POST /api/razorpay/order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  // Check for Mock Mode
  if (process.env.RAZORPAY_KEY_ID.startsWith('mock_')) {
    res.json({
      id: `order_mock_${Date.now()}`,
      currency: 'INR',
      amount: Math.round(amount * 100),
    });
    return;
  }

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: Math.round(amount * 100), // Amount in paise (100 paise = 1 INR)
    currency: 'INR',
    receipt: `receipt_order_${Date.now()}`,
  };

  const order = await instance.orders.create(options);

  if (!order) {
    res.status(500);
    throw new Error('Something went wrong with Razorpay');
  }

  res.json(order);
});

// @desc    Verify Razorpay Payment
// @route   POST /api/razorpay/verify
// @access  Private
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  // Mock verification
  if (process.env.RAZORPAY_KEY_ID.startsWith('mock_')) {
    const order = await Order.findById(orderId);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: razorpay_payment_id || 'mock_payment_id',
        status: 'COMPLETED',
        update_time: Date.now(),
        email_address: req.user.email,
      };
      const updatedOrder = await order.save();
      res.json({ message: 'Payment verified successfully (MOCK)', order: updatedOrder });
      return;
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  }

  const body = razorpay_order_id + '|' + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Payment is verified, update the order status in DB
    const order = await Order.findById(orderId);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: razorpay_payment_id,
        status: 'COMPLETED',
        update_time: Date.now(),
        email_address: req.user.email,
      };

      const updatedOrder = await order.save();
      res.json({ message: 'Payment verified successfully', order: updatedOrder });
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } else {
    res.status(400);
    throw new Error('Payment verification failed');
  }
});

// @desc    Get Razorpay Key ID
// @route   GET /api/razorpay/key
// @access  Public
const getRazorpayKey = asyncHandler(async (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

export { createRazorpayOrder, verifyRazorpayPayment, getRazorpayKey };
