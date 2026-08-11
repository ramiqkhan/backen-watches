import Order from '../models/Order.js';
import Watch from '../models/Watch.js';

const orderService = {
  createOrder: async (orderData) => {
    const { orderItems, shippingAddress, paymentMethod, userId } = orderData;

    if (!orderItems || orderItems.length === 0) {
      throw new Error('No order items provided');
    }

    let calculatedTotalPrice = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
      const watch = await Watch.findById(item.watch);
      if (!watch) {
        throw new Error(`Watch with ID ${item.watch} not found`);
      }

      verifiedOrderItems.push({
        watch: watch._id,
        quantity: item.quantity,
        price: watch.price
      });

      calculatedTotalPrice += watch.price * item.quantity;
    }

    let orderId;
    let isUnique = false;
    while (!isUnique) {
      orderId = Math.floor(100000 + Math.random() * 900000).toString();
      const existingOrder = await Order.findOne({ orderId });
      if (!existingOrder) {
        isUnique = true;
      }
    }

    const order = new Order({
      orderId,
      user: userId || null,
      orderItems: verifiedOrderItems,
      shippingAddress,
      paymentMethod,
      totalPrice: calculatedTotalPrice,
      orderStatus: 'Pending'
    });

    return await order.save();
  },

  getOrderById: async (id) => {
    const order = await Order.findById(id).populate('orderItems.watch', 'name brand images price');
    if (!order) throw new Error('Order not found');
    return order;
  },

  getOrderByTrackingId: async (orderId, queryParam) => {
    const order = await Order.findOne({ 
      orderId: orderId.toUpperCase() 
    }).populate('orderItems.watch', 'name brand images price');

    if (!order) {
      throw new Error('Order not found with the provided Order ID');
    }

    const emailMatch = queryParam.email && order.shippingAddress.email.toLowerCase() === queryParam.email.toLowerCase();
    const phoneMatch = queryParam.phone && order.shippingAddress.phone === queryParam.phone;

    if (!emailMatch && !phoneMatch) {
      throw new Error('Contact information (email or phone) does not match this order');
    }

    return order;
  },

  getAllOrders: async () => {
    return await Order.find({}).populate('orderItems.watch', 'name brand price');
  },

  updateOrderToPaid: async (id, paymentResult) => {
    const order = await Order.findById(id);
    if (!order) throw new Error('Order not found');

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: paymentResult.id,
      status: paymentResult.status,
      update_time: paymentResult.update_time,
      email_address: paymentResult.email_address
    };
    order.orderStatus = 'Processing';

    return await order.save();
  },

  updateOrderStatus: async (id, status) => {
    const order = await Order.findById(id);
    if (!order) throw new Error('Order not found');

    order.orderStatus = status;
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    return await order.save();
  },

  deleteOrder: async (id) => {
    const order = await Order.findByIdAndDelete(id);
    if (!order) throw new Error('Order not found');
    return { message: 'Order removed successfully' };
  }
};

export default orderService;