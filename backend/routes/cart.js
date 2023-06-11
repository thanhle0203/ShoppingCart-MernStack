// cart.js

const express = require('express');
const router = express.Router();
const CartItem = require('../models/cart');
const Product = require('../models/product');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authMiddleware to all routes
router.use(authMiddleware);

// Retrieve cart items and calculate total price
router.get('/', async (req, res) => {
  try {
    const cartItems = await CartItem.find({ user: req.user._id });
    const totalPrice = cartItems.reduce((total, item) => {
      return total + item.quantity * item.productPrice;
    }, 0);
    res.json({ cartItems, totalPrice });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'An error occurred while fetching cart items' });
  }
});

// Add item to cart
router.post('/', async (req, res) => {
  try {
    const { product } = req.body;
    const productData = await Product.findById(product); // Fetch the product data
    const cartItem = new CartItem({
      user: req.user._id,
      product,
      quantity: 1,
      productName: productData.name, // Set the productName field
      productPrice: productData.price,
      productImage: productData.imageUrl,
    });
    const savedItem = await cartItem.save();

    // Fetch the updated cart items from the database
    const updatedCartItems = await CartItem.find({ user: req.user._id });

    res.status(201).json({ cartItems: updatedCartItems });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'An error occurred while adding item to cart' });
  }
});

// Update cart item quantity
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const updatedItem = await CartItem.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );
    res.json({ cartItem: updatedItem });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'An error occurred while updating cart item' });
  }
});

// Remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await CartItem.findByIdAndRemove(id);
    res.json({ message: 'Cart item deleted' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ message: 'An error occurred while deleting cart item' });
  }
});

module.exports = router;
