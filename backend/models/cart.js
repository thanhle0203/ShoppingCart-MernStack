const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      productName: {
        type: String,
        required: true,
      },
      productPrice: {
        type: Number,
        required: true,
      },
      productImage: {
        type: String,
      },
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  }
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
