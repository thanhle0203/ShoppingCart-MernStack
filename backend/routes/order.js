const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Order = require('../models/order');
const Product = require('../models/product');
const CartItem = require('../models/cart');
const { sendEmail } = require('../utils/emailUtils');

const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

    // Check if the order belongs to the logged-in user
    if (order.user.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Unauthorized access to order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ...

// Handle checkout
// router.post('/checkout', async (req, res) => {
//   try {
//     const { sessionUrl } = req.body;

//     // Create a Stripe session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: lineItems,
//       mode: 'payment',
//       success_url: 'http://localhost:3000/success', // Replace with your success URL
//       cancel_url: 'http://localhost:3000/cart', // Replace with your cancel URL
//     });

//     res.json({ sessionUrl: session.url });
//   } catch (error) {
//     console.error('Error creating Stripe session:', error);
//     res.status(500).json({ message: 'An error occurred while creating the Stripe session' });
//   }
// });

// ...

router.post('/checkout', async (req, res) => {
  try {
    const { sessionUrl } = req.body;
    const userId = req.user._id;

    // Retrieve cart items for the user
    const cartItems = await CartItem.find({ user: userId });
    console.log("cartItems: ", cartItems)

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total price
    // Calculate total price
// const totalPrice = cartItems.reduce((total, item) => {
//   const product = item.products[0].product;
//   return total + product.quantity * product.productPrice;
// }, 0);

const totalPrice = cartItems.reduce((total, item) => {
  return total +  item.totalPrice;
}, 0);

    // Calculate total price
const totalPriceInCents = Math.round(totalPrice * 100);
console.log("totalPriceInCents", totalPriceInCents)

//const quantity = 1

// ...

// Create an array of line items for the Stripe session
    // Create an array of line items for the Stripe session
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(item.totalPrice * 100), // Set the unit amount to the total price of the item in cents
        product_data: {
          id: item.products[0].product._id,
          name: item.products[0].productName,
          // price: item.products[0].productPrice,
          // quantity: item.products[0].quantity,
          // image: item.products[0].productImage,
        },
      },
      quantity: item.products[0].quantity,
    }));

    console.log(lineItems)

    // Create a Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success', // Replace with your success URL
      cancel_url: 'http://localhost:3000/cart', // Replace with your cancel URL
    });

    // Create a new order instance in your database
    const order = new Order({
      user: userId,
      products: cartItems.map((item) => ({
        product: item.products[0].product, // Provide the product ID
        productName: item.products[0].productName, // Provide the product name
        quantity: item.products[0].quantity, // Provide the quantity
        price: item.totalPrice, // Provide the total price
      })),
      totalPrice,
      shippingAddress: req.body.shippingAddress,
      stripeSessionId: session.id,
    });

    // Save the order in the database
    await order.save();

    // Send order receipt email
    sendEmail({
      to: req.user.email, // Assuming the user's email is stored in the req.user.email property
      subject: 'Order Receipt',
      text: 'Thank you for your order!',
      html: '<p>Thank you for your order!</p>',
    });


    // Clear the user's cart
    await CartItem.deleteMany({ user: userId });

    // Return the session URL and order details to the client
    res.json({ sessionUrl: session.url, order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
