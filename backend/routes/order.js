const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Order = require('../models/order');
const router = express.Router();

// Apply authMiddleware to all routes
router.use(authMiddleware);

// Get all orders for a logged-in user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    //console.log("UserId: ", userId)
    const orders = await Order.find({ user: userId }).populate('user', 'username');
    res.json(orders);
    //console.log(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get details of a specific order
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await Order.findById(req.params.id).populate('user', 'username');
    console.log("Order details: ", order)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order belongs to the logged-in user
   // if (order.user.toString() !== req.user.id) {
      //return res.status(403).json({ message: 'Unauthorized access to order' });
    //}

    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    // Assuming the request body contains necessary order data
    const { products, totalPrice, shippingAddress } = req.body;

    const newOrder = new Order({
      user: req.user.id,
      products,
      totalPrice,
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
