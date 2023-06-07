const mongoose = require('mongoose');
const { Schema } = mongoose;
const CartItem = require('./cart');


const orderSchema = new Schema(
  {
    cartItems: [
      {
        type: Schema.Types.ObjectId,
        ref: 'CartItem',
        required: true,
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
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'payment failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
