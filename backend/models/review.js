const mongoose = require('mongoose');

<<<<<<< HEAD
const reviewSchema = new mongoose.Schema({
<<<<<<< HEAD
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Review', reviewSchema);
=======
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
=======
const reviewSchema = new mongoose.Schema(
  {
>>>>>>> afb56b1 (implement Review functionality)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

<<<<<<< HEAD
module.exports = mongoose.model('Review', reviewSchema);
>>>>>>> 4e58585 (implement review functionality)
=======
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
>>>>>>> afb56b1 (implement Review functionality)
