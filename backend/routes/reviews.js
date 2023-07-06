const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Review = require('../models/review');
const Product = require('../models/product');

const router = express.Router();

// create a review for a product
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user._id;

        const product = await Product.findById(productId).populate('reviews');

        if (!product) {
            return res.status(404).json({ message: 'Product not found'});
        }

        const review = new Review ({
            rating,
            comment,
            user: userId, 
            product: productId,
        });

        await review.save();

        res.status(201).json({ message: 'Review created successfully'});
    
    } catch (error) {
        console.error('Error creating review: ', error);
        res.status(500).json({ message: 'An error occured while creating reviews'})
    }
});

module.exports = router;