import {combineReducers} from 'redux';
import cartReducer from './cart/reducer/cart';
import filterReducer from './filter/reducer/filter';
import productReducer from './product/reducer/product';

// Combine all reducers into one root reducer
export default combineReducers({
  cartReducer,
  productReducer,
  filterReducer,
});
