const mongoose = require('mongoose');
const CartItem = require('./cartItem');

const orderSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CartItem',
      },
    ],
    paymentInfo: {
      paymentMethod: {
        type: String,
        required: true,
      },
      cardNumber: {
        type: String,
        required: true,
      },
      expiryDate: {
        type: String,
        required: true,
      },
      cvv: {
        type: String,
        required: true,
      },
      billingAddress: {
        type: String,
        required: true,
      },
      // Add any other payment-related fields you need
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'payment failed'],
      default: 'pending',
    },
    // Add any other fields you need for the order
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
