import {CLEAR_CART, CLEAR_DATA} from '../../actions';
import {
  REQUESTING_STATUS,
  REQUESTING_TRACKER,
  SET_ORDER_DETAILS,
} from '../actions';

const initialState = {
  orderDetails: null,
  requestingStatus: false,
  requestingTracker: false,
};

const orderReducer = (state = initialState, action: any) => {
  const {type, payload} = action;

  switch (type) {
    case SET_ORDER_DETAILS:
      return Object.assign({}, state, {
        orderDetails: payload,
      });

    case REQUESTING_STATUS:
      return Object.assign({}, state, {
        requestingStatus: payload,
      });

    case REQUESTING_TRACKER:
      return Object.assign({}, state, {
        requestingTracker: payload,
      });

    case CLEAR_CART:
    case CLEAR_DATA:
      return initialState;

    default:
      return state;
  }
};

export default orderReducer;
