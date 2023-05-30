// Define the initial state of the cart
const initialState = {
  items: [],
  total: 0
};

// Define the cart reducer function
const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      // Add the item to the cart
      const newItem = action.payload;
      const updatedItems = [...state.items, newItem];
      const updatedTotal = state.total + getItemPrice(newItem.id, action.products);

      return {
        ...state,
        items: updatedItems,
        total: updatedTotal
      };

    case 'REMOVE_FROM_CART':
      // Remove the item from the cart
      const itemId = action.payload;
      const updatedCart = state.items.filter(item => item.id !== itemId);
      const updatedCartTotal = state.total - getItemPrice(itemId, action.products);

      return {
        ...state,
        items: updatedCart,
        total: updatedCartTotal
      };

    case 'CLEAR_CART':
      // Clear the cart
      return {
        ...state,
        items: [],
        total: 0
      };

    default:
      return state;
  }
};

// Helper function to get the price of an item by ID
const getItemPrice = (itemId, products) => {
  // Replace this with your logic to fetch the price of an item from the product data

  // For example:
  const product = products.find(product => product.id === itemId);
  return product ? product.price : 0;
};

export default cartReducer;
