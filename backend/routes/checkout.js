// checkout.js

const express = require('express');
const router = express.Router();
const Checkout = require('../models/checkout');
const CartItem = require('../models/cart');
const Order = require('../models/order');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');
const PaymentGateway = require('../libraries/paymentGateway');

router.use(authMiddleware);

const processCheckout = async (userId, cartItems, paymentInfo) => {
  try {
    const populatedCartItems = await CartItem.find({ _id: { $in: cartItems } }).populate('product');
    const totalPrice = populatedCartItems.reduce(
      (total, item) => total + item.quantity * item.product.productPrice,
      0
    );

    const order = new Order({
      user: userId,
      products: populatedCartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalPrice: totalPrice,
      status: 'completed',
    });

    const savedOrder = await order.save();
    await CartItem.deleteMany({ _id: { $in: cartItems } });

    return savedOrder;
  } catch (error) {
    console.error('Error processing checkout:', error);
    throw new Error('Failed to process checkout');
  }
};


// router.post('/', authMiddleware, async (req, res) => {
//   const { cartItems, paymentInfo } = req.body;
//   const userId = req.user;

//   try {
//     const paymentGateway = new PaymentGateway();
//     const paymentResult = await paymentGateway.processPayment(paymentInfo);

//     if (paymentResult.success) {
//       const savedOrder = await processCheckout(userId, cartItems, paymentInfo);
//       res.json({ success: true, order: savedOrder });
//     } else {
//       res.json({ success: false, error: paymentResult.error });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

router.post('/', authMiddleware, async (req, res) => {
  const { cartItems, paymentInfo } = req.body;
  const userId = req.user;

  try {
    const paymentGateway = new PaymentGateway();
    const paymentResult = await paymentGateway.processPayment(paymentInfo);

    if (paymentResult.success) {
      const savedOrder = await processCheckout(userId, cartItems, paymentInfo);
      res.json({ success: true, order: savedOrder });
    } else {
      console.log('Payment result:', paymentResult); // Add this log statement
      res.json({ success: false, error: paymentResult.error, data: {} });
    }
  } catch (error) {
    console.log('Error during checkout:', error); // Add this log statement
    res.status(500).json({ success: false, error: error.message, data: {} });
  }
});



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
