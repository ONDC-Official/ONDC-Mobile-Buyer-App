import {combineReducers} from 'redux';
import authReducer from './auth/reducer/auth';
import cartReducer from './cart/reducer/cart';
import filterReducer from './filter/reducer/filter';
import productReducer from './product/reducer/product';
import locationReducer from './location/reducer/location';

// Combine all reducers into one root reducer
export default combineReducers({
  authReducer,
  cartReducer,
  productReducer,
  filterReducer,
  locationReducer,
});
