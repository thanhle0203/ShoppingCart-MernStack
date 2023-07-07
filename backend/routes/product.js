const express = require('express');
const authMiddleware = require('../middleware/authMiddleware.js');
const router = express.Router();
const Product = require('../models/product.js');
const Review = require('../models/review.js');

// Define API endpoints
router.get('/', async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find().populate('reviews');

    // Return the products as the response
    res.status(200).json(products);
  } catch (error) {
    // Handle any errors that occur during the database query
    res.status(500).json({ message: 'An error occurred while fetching products' });
  }
});

router.get('/search-products/', async (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    const regex = new RegExp(keyword, 'i'); // Case-insensitive search

    const products = await Product.find({ $or: [{ name: regex }, { category: regex }] });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'An error occurred while fetching products' });
  }
});

router.get('/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    // Fetch the product from the database by ID
    const product = await Product.findById(productId);

    // Check if the product exists
    if (product) {
      // Product found
      res.status(200).json(product);
    } else {
      // Product not found
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    // Handle any errors that occur during the database query
    res.status(500).json({ message: 'An error occurred while fetching the product' });
  }
});

router.post('/', async (req, res) => {
  // Access the product data from req.body
  const productData = req.body;

  try {
    // Create a new product instance
    const newProduct = new Product(productData);

    // Save the new product to the database
    await newProduct.save();

    // Return a success response
    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    // Handle any errors that occur during the save operation
    res.status(500).json({ message: 'An error occurred while creating the product' });
  }
});

router.put('/:id', async (req, res) => {
  const productId = req.params.id;
  // Access the updated product data from req.body
  const updatedProductData = req.body;

  try {
    // Find the product by ID and update its properties
    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });

    // Check if the product was found and updated
    if (updatedProduct) {
      // Product updated successfully
      res.status(200).json(updatedProduct);
    } else {
      // Product not found
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    // Handle any errors that occur during the update operation
    res.status(500).json({ message: 'An error occurred while updating the product' });
  }
});

router.delete('/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(productId);

    // Check if the product was found and deleted
    if (deletedProduct) {
      // Product deleted successfully
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      // Product not found
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    // Handle any errors that occur during the delete operation
    res.status(500).json({ message: 'An error occurred while deleting the product' });
  }
});

router.post('/:id/reviews', authMiddleware, async (req, res) => {
  const productId = req.params.id;
  const userId = req.user._id;
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = new Review({
      rating,
      comment,
      user: userId,
      product: productId,
    });

    await review.save();

    product.reviews.push(review._id);
    const totalReviews = product.reviews.length;
    const ratingsSum = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = ratingsSum / totalReviews;

    await product.save();

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/comments/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId).populate('reviews');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product.reviews);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'An error occurred while fetching comments' });
  }
});


module.exports = router;
