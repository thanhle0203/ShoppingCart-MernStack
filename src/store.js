import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import cartReducer from './reducers/cartReducer';
import userReducer from './reducers/userReducer';
import productReducer from './reducers/productReducer';

// Combine multiple reducers into a root reducer
const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
  product: productReducer
});

// Create the Redux store with the root reducer and middleware
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
