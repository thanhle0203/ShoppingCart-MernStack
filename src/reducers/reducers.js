import { combineReducers } from 'redux';
import cartReducer from './cartReducer';
import userReducer from './userReducer';
import productReducer from './productReducer';

const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
  products: productReducer,
});

export default rootReducer;
