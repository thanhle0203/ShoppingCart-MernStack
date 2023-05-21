const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  imageUrl: { type: String },
  // Add more fields as per your product schema
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
