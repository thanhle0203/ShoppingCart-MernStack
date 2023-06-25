const express = require('express');
const router = express.Router();
const CartItem = require('../models/cart');
const Checkout = require('../models/checkout');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, customerName, customerEmail } = req.body;

    // Validate the items, customerName, and customerEmail

    // Create a new Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            // Add other product details as needed
          },
          unit_amount: parseFloat(item.price) * 100, // Ensure item.price is a valid number
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: 'http://localhost:3000/success', // Replace with your success URL
      cancel_url: 'http://localhost:3000/cancel', // Replace with your cancel URL
      customer_email: customerEmail, // Pass customerEmail to the session
      client_reference_id: customerName, // Pass customerName to the session
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});



router.get('/:id', async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id).populate('cartItems');
    if (!checkout) {
      return res.status(404).json({ error: 'Checkout not found' });
    }
    res.json(checkout);
  } catch (error) {
    console.error('Error fetching checkout details:', error);
    res.status(500).json({ error: 'Failed to fetch checkout details' });
  }
});

module.exports = router;
