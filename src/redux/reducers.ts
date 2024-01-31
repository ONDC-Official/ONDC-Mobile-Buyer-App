import {combineReducers} from 'redux';
import authReducer from './auth/reducer/auth';
import cartReducer from './cart/reducer/cart';
import addressReducer from './address/reducer/address';
import complaintReducer from './complaint/reducer/complaint';
import orderReducer from './order/reducer/order';

// Combine all reducers into one root reducer
export default combineReducers({
  authReducer,
  addressReducer,
  cartReducer,
  complaintReducer,
  orderReducer,
});
