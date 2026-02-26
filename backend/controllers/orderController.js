import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  // Check if user is verified
  // We only restrict regular users/farmers. Admins are exempt.
  if (!req.user.isAdmin) {
    if (!req.user.isFarmer && !req.user.isSupplier) {
      res.status(403);
      throw new Error('Access denied. Only registered farmers or suppliers can purchase agricultural products.');
    }
    if (!req.user.isVerified) {
      res.status(403);
      throw new Error('Identity verification required. Only verified farmers or suppliers can purchase agricultural products.');
    }
  }

  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to shipped
// @route   PUT /api/orders/:id/ship
// @access  Private/Admin or Farmer who owns the products
const updateOrderToShipped = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Check if admin OR if the logged-in user (farmer/supplier) owns any product in this order
    const isAdmin = req.user.isAdmin;
    const products = await Product.find({ user: req.user._id });
    const productIds = products.map((p) => p._id.toString());
    const ownsProductInOrder = order.orderItems.some((item) =>
      productIds.includes(item.product.toString())
    );

    if (!isAdmin && !ownsProductInOrder) {
      res.status(401);
      throw new Error('Not authorized to ship this order');
    }

    order.status = 'Shipped';
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin or User who placed the order or Farmer who owns the products
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'email');

  if (order) {
    // Check if admin OR owner of the order OR farmer who owns products in the order
    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.isAdmin;
    
    const products = await Product.find({ user: req.user._id });
    const productIds = products.map((p) => p._id.toString());
    const ownsProductInOrder = order.orderItems.some((item) =>
      productIds.includes(item.product.toString())
    );

    if (!isOwner && !isAdmin && !ownsProductInOrder) {
      res.status(401);
      throw new Error('Not authorized to mark this order as delivered');
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'Delivered';

    // If it's a COD order, marking as delivered also marks as paid
    if (order.paymentMethod === 'COD') {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: `COD_${Date.now()}`,
        status: 'Completed',
        update_time: Date.now().toString(),
        email_address: order.user.email || 'COD',
      };
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'id name')
    .sort({ createdAt: -1 });
    
  res.json(orders);
});

// @desc    Get logged in farmer orders
// @route   GET /api/orders/my-sales
// @access  Private/Farmer
const getFarmerOrders = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user._id });
  const productIds = products.map((p) => p._id);
  const orders = await Order.find({ 'orderItems.product': { $in: productIds } })
    .populate('user', 'id name')
    .sort({ createdAt: -1 });
  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToShipped,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getFarmerOrders,
};
