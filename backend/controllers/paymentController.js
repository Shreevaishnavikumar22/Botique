const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const util = require('util');

let instance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.warn('Razorpay keys are not set. Payment gateway will not work until RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are configured.');
}

// Create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // Filter out items with null/undefined products and calculate amount
    const validItems = cart.items.filter(item => item.product && item.product.price);
    
    if (validItems.length === 0) {
      return res.status(400).json({ message: 'No valid products in cart' });
    }

    const amount = validItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid cart amount' });
    }

    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
    };

    if (!instance) {
      return res.status(500).json({ success: false, message: 'Payment gateway not configured' });
    }

    let order;
    try {
      order = await instance.orders.create(options);
    } catch (err) {
      // Log detailed error for debugging
      console.error('Razorpay create order error:', util.inspect(err, { depth: 4 }));
      const errMessage = err.error?.description || err.message || 'Unknown error from payment gateway';
      const statusCode = err.statusCode || err.status || 502;
      return res.status(statusCode).json({ success: false, message: errMessage });
    }

    if (!order) {
      return res.status(500).json({ success: false, message: 'Razorpay order creation failed' });
    }

    return res.json(order);

  } catch (error) {
    console.error('CreateOrder error:', error);
    res.status(500).send(error);
  }
};

// Verify payment and create order in DB
exports.verifyPayment = async (req, res) => {
  try {
    const { order_id, razorpay_payment_id, razorpay_signature, shippingAddress } = req.body;

    // Generate signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.json({ success: false, message: "Payment verification failed" });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) return res.status(400).json({ message: 'Cart not found' });

    // Filter out items with null/undefined products
    const validItems = cart.items.filter(item => item.product && item.product._id);
    
    if (validItems.length === 0) {
      return res.status(400).json({ message: 'No valid products in cart' });
    }

    // Generate unique orderNumber
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const orderCount = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    const sequence = (orderCount + 1).toString().padStart(4, '0');
    const orderNumber = `FLR${year}${month}${day}${sequence}`;  // Changed from BAT to FLR for Flower

    // Prepare order items with safety checks
    const orderItems = validItems.map(item => ({
      product: item.product._id,
      name: item.product.name || 'Unknown Product',
      price: item.product.price || 0,
      quantity: item.quantity,
      image: item.product.images && item.product.images[0] ? item.product.images[0].url : '',
    }));

    // Create new order in DB
    const newOrder = new Order({
      user: req.user.id,
      orderNumber,
      items: orderItems,
      shippingAddress: shippingAddress || {},
      paymentInfo: {
        method: 'online',
        status: 'completed',
        transactionId: razorpay_payment_id,
        paidAt: new Date(),
      },
      orderStatus: 'processing',
    });

    // Calculate pricing
    newOrder.calculatePricing();

    await newOrder.save();
    await cart.clearCart();

    res.json({
      success: true,
      message: "Payment verified and order placed successfully",
      orderId: newOrder._id,
    });

  } catch (error) {
    console.error('verifyPayment error:', error);
    res.status(500).send(error);
  }
};

// Get Razorpay key
exports.getKey = (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
};
