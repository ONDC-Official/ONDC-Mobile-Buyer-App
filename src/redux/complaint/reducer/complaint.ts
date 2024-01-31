import {CLEAR_CART, CLEAR_DATA} from '../../actions';
import {SET_COMPLAINT} from '../actions';

const initialState = {
  complaintDetails: null,
};

const complaintReducer = (state = initialState, action: any) => {
  const {type, payload} = action;

  switch (type) {
    case SET_COMPLAINT:
      return Object.assign({}, state, {
        complaintDetails: payload,
      });

    case CLEAR_CART:
    case CLEAR_DATA:
      return initialState;

    default:
      return state;
  }
};

export default complaintReducer;
