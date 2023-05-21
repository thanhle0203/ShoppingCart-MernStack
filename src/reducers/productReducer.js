// Define the initial state of the products
const initialState = {
    products: [],
    loading: false,
    error: null
  };
  
  // Define the product reducer function
  const productReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_PRODUCTS_REQUEST':
        // Set loading to true when fetching products
        return {
          ...state,
          loading: true
        };
  
      case 'FETCH_PRODUCTS_SUCCESS':
        // Update the products array with fetched products
        const fetchedProducts = action.payload;
        return {
          ...state,
          products: fetchedProducts,
          loading: false,
          error: null
        };
  
      case 'FETCH_PRODUCTS_FAILURE':
        // Set error message when fetching products fails
        const errorMessage = action.payload;
        return {
          ...state,
          loading: false,
          error: errorMessage
        };
  
      default:
        return state;
    }
  };
  
  export default productReducer;
  