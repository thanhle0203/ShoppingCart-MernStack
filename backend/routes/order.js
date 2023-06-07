const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Order = require('../models/order');

const router = express.Router();

// Get all orders for a logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('user', 'username');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get details of a specific order
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'username');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order belongs to the logged-in user
    if (order.user.id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new order
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Assuming the request body contains necessary order data
    const { products, totalAmount, shippingAddress } = req.body;

    const newOrder = new Order({
      user: req.user.id,
      products,
      totalAmount,
      shippingAddress,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
