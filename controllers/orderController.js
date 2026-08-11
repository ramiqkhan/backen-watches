import orderService from '../services/orderService.js';

const orderController = {
  createOrder: async (req, res) => {
    try {
      const order = await orderService.createOrder({
        ...req.body,
        userId: req.user ? req.user._id : null
      });
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const order = await orderService.getOrderById(req.params.id);
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  getOrderByTrackingId: async (req, res) => {
    try {
      const { id } = req.params;
      const { email, phone } = req.query;

      const order = await orderService.getOrderByTrackingId(id, { email, phone });
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const orders = await orderService.getAllOrders();
      res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateOrderToPaid: async (req, res) => {
    try {
      const updatedOrder = await orderService.updateOrderToPaid(req.params.id, req.body);
      res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const updatedOrder = await orderService.updateOrderStatus(req.params.id, status);
      res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const result = await orderService.deleteOrder(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
};

export default orderController;