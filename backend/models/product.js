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
  },
<<<<<<< HEAD
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  // rating: {
  //   type: Number,
  //   default: 0,
  // },
=======
  // Add more fields as per your product schema
 
>>>>>>> 4e58585 (implement review functionality)

});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
