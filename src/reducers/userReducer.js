// Define the initial state of the user
const initialState = {
    loggedIn: false,
    username: '',
    email: ''
  };
  
  // Define the user reducer function
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN':
        // Update the state to indicate that the user is logged in
        const { username, email } = action.payload;
        return {
          loggedIn: true,
          username,
          email
        };
  
      case 'LOGOUT':
        // Update the state to indicate that the user is logged out
        return {
          loggedIn: false,
          username: '',
          email: ''
        };
  
      default:
        return state;
    }
  };
  
  export default userReducer;
  