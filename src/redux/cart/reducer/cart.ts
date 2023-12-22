import {CLEAR_CART, CLEAR_DATA} from '../../actions';
import {SET_CART_ITEMS} from '../actions';

const initialState = {
  cartItems: [],
};

const cartReducer = (state = initialState, action: any) => {
  const {type, payload} = action;

  switch (type) {
    case SET_CART_ITEMS:
      return Object.assign({}, state, {
        cartItems: payload,
      });

    case CLEAR_CART:
    case CLEAR_DATA:
      return initialState;

    default:
      return state;
  }
};

export default cartReducer;
