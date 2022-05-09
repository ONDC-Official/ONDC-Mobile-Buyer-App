import {CLEAR_CART} from '../../actions';
import {UPDATE_PRODUCT_CART} from '../../actions';
import {REMOVE_PRODUCT_CART} from '../../actions';
import {ADD_PRODUCT_CART} from '../../actions';
import {CLEAR_DATA} from '../../actions';

const initialState = {
  cartItems: [],
};

const cartReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case ADD_PRODUCT_CART:
      const list = state.cartItems.slice();
      list.push(payload);
      return Object.assign({}, state, {cartItems: list});

    case REMOVE_PRODUCT_CART:
      const removeIndex = state.cartItems.findIndex(
        product => product.id === payload.id,
      );
      if (removeIndex > -1) {
        const list = state.cartItems.filter(
          product => product.id !== payload.id,
        );
        return Object.assign({}, state, {cartItems: list});
      } else {
        return state;
      }

    case UPDATE_PRODUCT_CART:
      const updateIndex = state.cartItems.findIndex(
        product => product.id === payload.id,
      );
      if (updateIndex > -1) {
        const list = state.cartItems.slice();
        list[updateIndex] = payload;
        return Object.assign({}, state, {cartItems: list});
      } else {
        return state;
      }

    case CLEAR_CART:
    case CLEAR_DATA:
      return initialState;

    default:
      return state;
  }
};

export default cartReducer;
