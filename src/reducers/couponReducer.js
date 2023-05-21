// Define the initial state of the coupon
const initialState = {
    couponCode: null,
    discount: 0,
    applied: false
  };
  
  // Define the coupon reducer function
  const couponReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'APPLY_COUPON':
        // Apply the coupon code and update the discount
        const { couponCode, discount } = action.payload;
        return {
          couponCode,
          discount,
          applied: true
        };
  
      case 'REMOVE_COUPON':
        // Remove the applied coupon
        return initialState;
  
      default:
        return state;
    }
  };
  
  export default couponReducer;
  