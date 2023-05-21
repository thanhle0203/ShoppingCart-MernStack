// Define the initial state of the checkout
const initialState = {
    cartItems: [],
    shippingAddress: '',
    paymentMethod: ''
  };
  
  // Define the checkout reducer function
  const checkoutReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_TO_CART':
        // Add an item to the cart
        const newItem = action.payload;
        return {
          ...state,
          cartItems: [...state.cartItems, newItem]
        };
  
      case 'REMOVE_FROM_CART':
        // Remove an item from the cart
        const itemId = action.payload;
        return {
          ...state,
          cartItems: state.cartItems.filter(item => item.id !== itemId)
        };
  
      case 'SET_SHIPPING_ADDRESS':
        // Set the shipping address
        const address = action.payload;
        return {
          ...state,
          shippingAddress: address
        };
  
      case 'SET_PAYMENT_METHOD':
        // Set the payment method
        const method = action.payload;
        return {
          ...state,
          paymentMethod: method
        };
  
      case 'CLEAR_CART':
        // Clear the cart
        return {
          ...state,
          cartItems: []
        };
  
      default:
        return state;
    }
  };
  
  export default checkoutReducer;
  