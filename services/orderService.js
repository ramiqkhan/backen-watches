import Order from '../models/Order.js';
import Watch from '../models/Watch.js';
import Strap from '../models/WatchStrap.js';

const fetchProductAcrossCollections = async (productId) => {
  if (!productId) return null;
  if (typeof productId === 'object' && productId !== null) return productId;

  try {
    let product = await Watch.findById(productId).lean();
    if (!product) {
      product = await Strap.findById(productId).lean();
    }
    return product;
  } catch (err) {
    return null;
  }
};

const orderService = {
  createOrder: async (orderData) => {
    const { orderItems, shippingAddress, paymentMethod, userId } = orderData;

    if (!orderItems || orderItems.length === 0) {
      throw new Error('No order items provided');
    }

    let calculatedTotalPrice = 0;
    const verifiedOrderItems = [];

  for (const item of orderItems) {
      const productId = item.watch || item.productId;
      const product = await fetchProductAcrossCollections(productId);

      if (!product) {
        throw new Error(`Item with ID ${productId} not found in product collections`);
      }

      // Safely resolve the image string from multiple fallback locations
      const resolvedImage = 
        product.image || 
        product.imageUrl || 
        product.img || 
        item.image || 
        "https://via.placeholder.com/150";

      verifiedOrderItems.push({
        watch: product._id,
        name: product.name,
        image: typeof resolvedImage === "string" ? resolvedImage : resolvedImage.url || "https://via.placeholder.com/150",
        quantity: item.quantity,
        price: product.price
      });

      calculatedTotalPrice += product.price * item.quantity;
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
    const order = await Order.findById(id).populate('user', 'email fullName').lean();
    if (!order) throw new Error('Order not found');

    for (let item of order.orderItems) {
      const product = await fetchProductAcrossCollections(item.watch);
      item.watch = product || { name: 'Unknown / Deleted Product', price: item.price };
    }

    return order;
  },

  getOrderByTrackingId: async (orderId, queryParam) => {
    const order = await Order.findOne({ 
      orderId: orderId.toUpperCase() 
    }).populate('user', 'email fullName').lean();

    if (!order) {
      throw new Error('Order not found with the provided Order ID');
    }

    const emailMatch = queryParam.email && order.shippingAddress.email.toLowerCase() === queryParam.email.toLowerCase();
    const phoneMatch = queryParam.phone && order.shippingAddress.phone === queryParam.phone;

    if (!emailMatch && !phoneMatch) {
      throw new Error('Contact information (email or phone) does not match this order');
    }

    for (let item of order.orderItems) {
      const product = await fetchProductAcrossCollections(item.watch);
      item.watch = product || { name: 'Unknown / Deleted Product', price: item.price };
    }

    return order;
  },

  getAllOrders: async () => {
    const orders = await Order.find({}).lean();

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const enrichedItems = await Promise.all(
          (order.orderItems || []).map(async (item) => {
            const product = await fetchProductAcrossCollections(item.watch);
            return {
              ...item,
              watch: product || { name: 'Unknown / Deleted Product', price: item.price }
            };
          })
        );
        return {
          ...order,
          orderItems: enrichedItems
        };
      })
    );

    return enrichedOrders;
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