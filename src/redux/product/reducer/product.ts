import {ADD_PRODUCT_CART, CLEAR_CART, CLEAR_DATA, REMOVE_PRODUCT_CART, UPDATE_PRODUCT_CART,} from '../../actions';
import {CLEAR_PRODUCTS, SAVE_PRODUCTS} from '../actions';

const initialState = {
  products: [],
};

const productReducer = (state = initialState, action: any) => {
  const {type, payload} = action;

  switch (type) {
    case SAVE_PRODUCTS:
      const products = state.products.concat(
        payload.filter(
          item => state.products.findIndex(one => one.id === item.id) < 0,
        ),
      );
      return Object.assign({}, state, {
        products,
      });

    case CLEAR_PRODUCTS:
      return Object.assign({}, state, {
        products: [],
      });

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
