const express = require('express');
const router = express.Router();

const Checkout = require('../models/checkout');

// POST /api/checkout
router.post('/', async (req, res) => {
  const { cartItems, paymentInfo } = req.body;

  try {
    const result = await Checkout.processCheckout(cartItems, paymentInfo);
    res.json(result);
  } catch (error) {
    console.error('Error processing checkout:', error);
    res.status(500).json({ error: 'Failed to process checkout' });
  }
});

module.exports = router;
