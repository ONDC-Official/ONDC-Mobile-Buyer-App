import {combineReducers} from 'redux';
import authReducer from './auth/reducer/auth';
import cartReducer from './cart/reducer/cart';
import addressReducer from './address/reducer/address';

// Combine all reducers into one root reducer
export default combineReducers({
  authReducer,
  addressReducer,
  cartReducer,
});
