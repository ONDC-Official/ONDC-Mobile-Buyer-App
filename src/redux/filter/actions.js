export const SAVE_FILTERS = 'SAVE_FILTERS';
export const SAVE_IDS = 'SAVE_IDS';
export const CLEAR_FILTERS = 'CLEAR_FILTERS';

export const saveFilters = filters => {
  return {type: SAVE_FILTERS, payload: filters};
};

export const saveIds = (messageId, transactionId) => {
  return {
    type: SAVE_IDS,
    payload: {messageId: messageId, transactionId: transactionId},
  };
};

export const clearFilters = () => {
  return {type: CLEAR_FILTERS, payload: null};
};
