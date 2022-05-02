import {CLEAR_CART} from '../../actions';
import {UPDATE_PRODUCT_CART} from '../../actions';
import {REMOVE_PRODUCT_CART} from '../../actions';
import {ADD_PRODUCT_CART} from '../../actions';
import {CLEAR_DATA} from '../../actions';
import {SAVE_PRODUCTS} from '../actions';

const initialState = {
  products: [],
};

const productReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case SAVE_PRODUCTS:
      return Object.assign({}, state, {products: payload});

    case ADD_PRODUCT_CART:
      const addIndex = state.products.findIndex(
        product => product.id === payload.id,
      );
      if (addIndex > -1) {
        const list = state.products.slice();
        list[addIndex] = payload;
        return Object.assign({}, state, {products: list});
      } else {
        return state;
      }

    case REMOVE_PRODUCT_CART:
      const removeIndex = state.products.findIndex(
        product => product.id === payload.id,
      );
      if (removeIndex > -1) {
        const list = state.products.slice();
        list[removeIndex] = payload;
        return Object.assign({}, state, {products: list});
      } else {
        return state;
      }

    case UPDATE_PRODUCT_CART:
      const updateIndex = state.products.findIndex(
        product => product.id === payload.id,
      );
      if (updateIndex > -1) {
        const list = state.products.slice();
        list[updateIndex] = payload;
        return Object.assign({}, state, {products: list});
      } else {
        return state;
      }

    case CLEAR_CART:
      return Object.assign({}, state, {
        products: state.products.map(product => {
          product.quantity = 0;
          return product;
        }),
      });

    case CLEAR_DATA:
      return initialState;

    default:
      return state;
  }
};

export default productReducer;
