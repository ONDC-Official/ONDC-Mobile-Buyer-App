import {SET_ADDRESS} from '../actions';

const initialState = {
  address: null,
};

const addressReducer = (state = initialState, action: any) => {
  const {type, payload} = action;

  switch (type) {
    case SET_ADDRESS:
      return Object.assign({}, state, {
        address: payload,
      });

    default:
      return state;
  }
};

export default addressReducer;
