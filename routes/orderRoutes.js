import express from 'express';
import orderController from '../controllers/orderController.js';

const router = express.Router();

router.get('/', orderController.getAllOrders);
router.post('/', orderController.createOrder);

// Tracking Route (Must be placed before router.get('/:id') to avoid route collision)
router.get('/track/:id', orderController.getOrderByTrackingId);

router.get('/:id', orderController.getOrderById);
router.put('/:id/pay', orderController.updateOrderToPaid);
router.put('/:id/status', orderController.updateOrderStatus);
router.delete('/:id', orderController.deleteOrder);

export default router;