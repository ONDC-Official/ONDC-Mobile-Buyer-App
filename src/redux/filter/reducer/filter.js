import {CLEAR_FILTERS, SAVE_FILTERS, SAVE_IDS} from '../actions';

const initialState = {
  filters: null,
  messageId: null,
  transactionId: null,
};

const filterReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case SAVE_FILTERS:
      return Object.assign({}, state, {filters: payload});

    case SAVE_IDS:
      return Object.assign({}, state, {
        messageId: payload.messageId,
        transactionId: payload.transactionId,
      });

    case CLEAR_FILTERS:
      return initialState;

    default:
      return state;
  }
};

export default filterReducer;
