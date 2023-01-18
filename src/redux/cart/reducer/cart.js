import {ADD_PRODUCT_CART, CLEAR_CART, CLEAR_DATA, REMOVE_PRODUCT_CART, UPDATE_PRODUCT_CART,} from '../../actions';

const initialState = {
  cartItems: [],
  subTotal: 0,
};

const cartReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case ADD_PRODUCT_CART:
      const addProducts = state.cartItems.slice();
      addProducts.push(payload);
      const subTotal = addProducts.reduce((total, item) => {
        total += item.price.value * item.quantity;
        return total;
      }, 0);
      return Object.assign({}, state, {
        cartItems: addProducts,
        subTotal: subTotal,
      });

    case REMOVE_PRODUCT_CART:
      const removeIndex = state.cartItems.findIndex(
        product => product.id === payload.id,
      );
      if (removeIndex > -1) {
        const list = state.cartItems.filter(
          product => product.id !== payload.id,
        );
        const removedCartTotal = list.reduce((total, item) => {
          total += item.price.value * item.quantity;
          return total;
        }, 0);
        return Object.assign({}, state, {
          cartItems: list,
          subTotal: removedCartTotal,
        });
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
        const updatedCartTotal = list.reduce((total, item) => {
          total += item.price.value * item.quantity;
          return total;
        }, 0);
        return Object.assign({}, state, {
          cartItems: list,
          subTotal: updatedCartTotal,
        });
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
