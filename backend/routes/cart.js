const express = require('express');
const router = express.Router();
const CartItem = require('../models/cart');
const Product = require('../models/product');
const authMiddleware = require('../middleware/authMiddleware');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
    console.log("req.body: ", req.body)
    const { product } = req.body;
    console.log("product: ", product) 
    const productData = await Product.findById(product); // Fetch the product data
    console.log("productData: ", productData)
    if (!productData) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingCartItem = await CartItem.findOne({ user: req.user._id, product: product });

    if (existingCartItem) {
      // Increase quantity if the item already exists in the cart
      existingCartItem.quantity += 1;
      await existingCartItem.save();
      return res.status(200).json({ cartItem: existingCartItem });
    }

    const cartItem = new CartItem({
      user: req.user._id,
      products: [
        {
          product: productData._id,
          quantity: 1,
          productName: productData.name,
          productPrice: productData.price,
          productImage: productData.imageUrl,
        }
      ],
      totalPrice: productData.price
    });

    const savedItem = await cartItem.save();
    res.status(201).json({ cartItem: savedItem });
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
