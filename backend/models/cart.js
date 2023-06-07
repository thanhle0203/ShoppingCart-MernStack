const mongoose = require('mongoose');
const Product = require('./product');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productImage: { type: String },
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
