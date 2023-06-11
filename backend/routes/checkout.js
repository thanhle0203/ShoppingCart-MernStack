const express = require('express');
const router = express.Router();
const Checkout = require('../models/checkout');
const CartItem = require('../models/cart'); // Import the CartItem model
const Order = require('../models/order');
const User = require('../models/user')
const authMiddleware = require('../middleware/authMiddleware');

// Apply authMiddleware to all routes
router.use(authMiddleware);

const processCheckout = async (user, cartItems, paymentInfo) => {
  try {
    // Populate the cartItems array with complete cart item data
    const populatedCartItems = await CartItem.find({ _id: { $in: cartItems } });

    // Calculate the total price
    const totalPrice = populatedCartItems.reduce(
      (total, item) => total + item.quantity * item.productPrice,
      0
    );

    // Create a new order instance
    const order = new Order({
      user,
      products: populatedCartItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      totalPrice: totalPrice,
    });

    // Save the order to the database
    const savedOrder = await order.save();

    // Clear the cart items
    await CartItem.deleteMany({ _id: { $in: cartItems } });

    return savedOrder;
  } catch (error) {
    console.error('Error processing checkout:', error);
    throw new Error('Failed to process checkout');
  }
};

// POST /api/checkout
router.post('/', authMiddleware, async (req, res) => {
  const { cartItems, paymentInfo } = req.body;
  const userId = req.user; // Assuming the user ID is correctly set in the request

  try {
    const savedOrder = await processCheckout(userId, cartItems, paymentInfo);

    // Return a success response with the saved order
    res.json({ success: true, order: savedOrder });
  } catch (error) {
    // Return an error response
    res.status(500).json({ success: false, error: error.message });
  }
});


// GET /api/checkout/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await Checkout.findById(req.params.id).populate('cartItems');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

module.exports = router;
