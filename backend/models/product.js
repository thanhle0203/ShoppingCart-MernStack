const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  date_added: {
    type: Date,
    default: Date.now
  }
  // Add more fields as per your product schema
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
