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
    const product = await Product.findById(productId).populate("reviews");

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

router.get('/:productId/reviews', async (req, res) => {
  const productId = req.params.productId;

  try {
    const reviews = await Review.find({ product: productId }).populate('user', 'username');

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'An error occurred while fetching the reviews' });
  }
});

router.post('/comments/:productId', authMiddleware, async (req, res) => {
  const productId = req.params.productId;
  const { comment } = req.body;
  const userId = req.user._id;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    // Check if the product exists
    // if (!product) {
    //   return res.status(404).json({ message: 'Product not found' });
    // }

    // Create a new review instance
    const review = new Review({
      user: userId,
      product: productId,
      comment,
    });

    // Save the new review to the database
    await review.save();

    // Add the review to the product's reviews array
    product.reviews.push(review._id);
    await product.save();

    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'An error occurred while adding the comment' });
  }
});


router.get('/comments/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId).populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'username',
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const comments = product.reviews.map((review) => ({
      _id: review._id,
      comment: review.comment,
      user: review.user.username,
    }));

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'An error occurred while fetching the comments' });
  }
});

router.put('/:id/update-discount', async (req, res) => {
  const productId = req.params.id;
  const { discount } = req.body;

  try {
    // find the product by ID and update its discount
    const updatedProduct = await Product.findByIdAndUpdate(productId, { discount }, { new: true });

    // Check if the product was found and updated
    if (updatedProduct) {
      // Product discount updated successfully
      res.status(200).json(updatedProduct);
    } else {
      // Product not found
      res.status(404).json({ message: 'Product not found'});
    }
  } catch (error) {
    // Handle any errors that occur dufing the update operation
      res.status(500).json({ message: 'An error occurred while updating the product discount'})
  }
})


module.exports = router;
