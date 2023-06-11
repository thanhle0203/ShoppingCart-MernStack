const mongoose = require('mongoose');
const { Schema } = mongoose;

const checkoutSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cartItems: [
    {
      type: Schema.Types.ObjectId,
      ref: 'CartItem',
      required: true,
    },
  ],
  paymentInfo: {
    paymentMethod: { type: String, required: true },
    cardNumber: { type: String, required: true },
    expiryDate: { type: String, required: true },
    cvv: { type: String, required: true },
    billingAddress: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const Checkout = mongoose.model('Checkout', checkoutSchema);

module.exports = Checkout;
