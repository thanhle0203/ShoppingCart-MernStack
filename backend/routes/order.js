const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Order = require('../models/order');
const Product = require('../models/product');
const CartItem = require('../models/cart');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Review = require('../models/review.js')

// Apply authMiddleware to all routes
router.use(authMiddleware);

// Get all orders for a logged-in user
router.get('/', authMiddleware, async (req, res) => {
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
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const order = await Order.findById(req.params.id).populate('user', 'username');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order belongs to the logged-in user
    // if (order.user.toString() !== req.user._id) {
    //   return res.status(403).json({ message: 'Unauthorized access to order' });
    // }

    order.status = 'completed'
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

    // Retrieve cart items for the user
    const cartItems = await CartItem.find({ user: userId });
    console.log("cartItems: ", cartItems)

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total price
    const totalPrice = cartItems.reduce((total, item) => {
      return total + item.totalPrice;
    }, 0);

    // Create an array of line items for the Stripe session
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

    // Create a Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cart',
    });

    // Create a new order instance in your database
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

    // Set the status of the order to "success"
    order.status = 'completed';
    // Save the order in the database
    await order.save();

    // Clear the user's cart
    await CartItem.deleteMany({ user: userId });

    // Return the session URL and order details to the client
    res.json({ sessionUrl: session.url, order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Handle successful payment
router.get('/success', authMiddleware, async (req, res) => {
  // try {
    const stripeSessionId = req.query.session_id;
    console.log("StripeSessionId: ", stripeSessionId)

    // Retrieve the order based on the Stripe session ID
    // const order = await Order.findOne({ stripeSessionId });
    const order = await Order.findOne({ stripeSessionId }).populate('user', 'username');


    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order belongs to the logged-in user
    if (order.user.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Unauthorized access to order' });
    }

    // Send the order receipt details to the client
    res.json(order);
  // } catch (error) {
  //   console.error('Error fetching order details:', error);
  //   res.status(500).json({ message: 'Server error' });
  // }
});

<<<<<<< HEAD
router.post('/reviews/:id', authMiddleware, async (req, res) => {
  const orderId = req.params.id;
  console.log("orderId: ", orderId);
  const userId = req.user._id;
  console.log("userId: ",userId );

  const { rating, comment, productId } = req.body;

  try {
    const order = await Order.findById(orderId);
=======
router.post('/:orderId/review', async (req, res) => {
  const orderId = req.params.orderId;
  const { rating, comment } = req.body;

  try {
    const order = await Order.findById(orderId).populate('products.product');
>>>>>>> afb56b1 (implement Review functionality)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

<<<<<<< HEAD
    const productId = order.products[0].product; // Assuming there is only one product in the order
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = new Review({
      rating,
      comment,
      user: userId,
      product: productId,
=======
    // Check if the order belongs to the logged-in user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if the order is already reviewed
    if (order.review) {
      return res.status(400).json({ message: 'Order already reviewed' });
    }

    // Create a new review
    const review = new Review({
      user: req.user._id,
      product: order.products[0].product._id, // Assuming there is only one product in the order
      rating,
      comment,
>>>>>>> afb56b1 (implement Review functionality)
    });

    await review.save();

<<<<<<< HEAD
    product.reviews.push(review._id);
    // const totalReviews = product.reviews.length;
    // const ratingsSum = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    // product.rating = ratingsSum / totalReviews;

    await product.save();

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




=======
    // Update the order with the review
    order.review = review._id;
    await order.save();

    res.status(201).json({ message: 'Review created successfully' });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'An error occurred while creating the review' });
  }
});
>>>>>>> afb56b1 (implement Review functionality)

module.exports = router;
