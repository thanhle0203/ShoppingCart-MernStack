const CartItem = require('../models/cartItem');
const Product = require('../models/product');

// Retrieve the product IDs from your data source
const getProductIds = async () => {
  try {
    // Fetch the product IDs from the database or any other data source
    const productIds = await Product.find().distinct('_id');
    return productIds;
  } catch (error) {
    console.error('Error fetching product IDs:', error);
    return [];
  }
};

const createCartItems = async () => {
  try {
    const productIds = await getProductIds();

    // Create an array of cart items based on the retrieved product IDs
    const cartItems = productIds.map((productId) => ({
      product: productId,
      quantity: 1,
    }));

    // Save the cart items to the database
    const savedItems = await CartItem.insertMany(cartItems);
    console.log('Cart items saved:', savedItems);
  } catch (error) {
    console.error('Error saving cart items:', error);
  }
};

const updateCartItem = async (itemId, quantity) => {
  try {
    const updatedItem = await CartItem.findByIdAndUpdate(itemId, { quantity }, { new: true });
    console.log('Cart item updated:', updatedItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
  }
};

const deleteCartItem = async (itemId) => {
  try {
    await CartItem.findByIdAndRemove(itemId);
    console.log('Cart item deleted:', itemId);
  } catch (error) {
    console.error('Error deleting cart item:', error);
  }
};

// Retry the process of creating cart items
const retryCreateCartItems = async (maxRetries = 3, retryInterval = 5000) => {
  let retries = 0;

  const performRetry = async () => {
    try {
      await createCartItems();
    } catch (error) {
      console.error(`Error creating cart items (Retry ${retries + 1}/${maxRetries}):`, error);
      retries++;

      if (retries < maxRetries) {
        setTimeout(performRetry, retryInterval);
      } else {
        console.error(`Maximum retry attempts (${maxRetries}) reached. Exiting.`);
      }
    }
  };

  performRetry();
};

module.exports = {
  createCartItems,
  updateCartItem,
  deleteCartItem,
  retryCreateCartItems,
};
