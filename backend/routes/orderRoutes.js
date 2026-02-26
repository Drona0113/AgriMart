import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToShipped,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getFarmerOrders,
} from '../controllers/orderController.js';
import { protect, admin, farmer } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/my-sales').get(protect, farmer, getFarmerOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/ship').put(protect, updateOrderToShipped);
router.route('/:id/deliver').put(protect, updateOrderToDelivered);

export default router;
