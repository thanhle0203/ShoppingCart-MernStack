const express = require('express');
const router = express.Router();
const Checkout = require('../models/checkout');
const CartItem = require('../models/cart'); // Import the CartItem model

// Process checkout
const processCheckout = async (cartItems, paymentInfo) => {
  try {
    // Populate the cartItems array with complete cart item data
    const populatedCartItems = await CartItem.find({ _id: { $in: cartItems } });

    // Create a new checkout instance
    const checkout = new Checkout({
      cartItems: populatedCartItems,
      paymentInfo,
    });

    // Save the checkout to the database
    const savedCheckout = await checkout.save();

    // Clear the cart items
    await CartItem.deleteMany({ _id: { $in: cartItems } });

    return savedCheckout;
  } catch (error) {
    console.error('Error processing checkout:', error);
    throw new Error('Failed to process checkout');
  }
};

// POST /api/checkout
router.post('/', async (req, res) => {
  const { cartItems, paymentInfo } = req.body;

  try {
    const savedCheckout = await processCheckout(cartItems, paymentInfo);

    // Return a success response
    res.json({ success: true, checkout: savedCheckout });
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
