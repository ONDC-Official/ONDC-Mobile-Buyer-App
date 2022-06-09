import {combineReducers} from 'redux';
import cartReducer from './cart/reducer/cart';
import productReducer from './product/reducer/product';
import filterReducer from './filter/reducer/filter';

// Combine all reducers into one root reducer
export default combineReducers({
  cartReducer,
  productReducer,
  filterReducer,
});
