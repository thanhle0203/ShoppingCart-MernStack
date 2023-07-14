const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Order = require('../models/order');
const Product = require('../models/product');
const CartItem = require('../models/cart');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Review = require('../models/review.js');

// Apply authMiddleware to all routes
router.use(authMiddleware);

// Get all orders for a logged-in user
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).populate('user', 'username');
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get details of a specific order
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user._id;
    const order = await Order.findById(req.params.id).populate('user', 'username');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = 'completed';
    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Handle checkout
router.post('/checkout', async (req, res) => {
  try {
    const { sessionUrl, shippingAddress } = req.body;
    const userId = req.user._id;

    const cartItems = await CartItem.find({ user: userId });
    console.log("cartItems: ", cartItems);

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const totalPrice = cartItems.reduce((total, item) => {
      return total + item.totalPrice;
    }, 0);

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(item.totalPrice * 100),
        product_data: {
          name: item.products[0].productName,
        },
      },
      quantity: item.products[0].quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cart',
    });

    const order = new Order({
      user: userId,
      products: cartItems.map((item) => ({
        product: item.products[0].product,
        productName: item.products[0].productName,
        quantity: item.products[0].quantity,
        price: item.totalPrice,
      })),
      totalPrice,
      shippingAddress,
      stripeSessionId: session.id,
    });

    order.status = 'completed';
    await order.save();

    await CartItem.deleteMany({ user: userId });

    res.json({ sessionUrl: session.url, order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Handle successful payment
router.get('/success', async (req, res) => {
  try {
    const stripeSessionId = req.query.session_id;
    console.log("StripeSessionId: ", stripeSessionId)

    const order = await Order.findOne({ stripeSessionId }).populate('user', 'username');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Unauthorized access to order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:orderId/review', async (req, res) => {
  const orderId = req.params.orderId;
  const { rating, comment } = req.body;

  try {
    const order = await Order.findById(orderId).populate('products.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const productId = order.products[0].product;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = new Review({
      rating,
      comment,
      user: req.user._id,
      product: productId,
    });

    await review.save();

    product.reviews.push(review._id);
    await product.save();

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
