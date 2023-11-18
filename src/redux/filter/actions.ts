export const SAVE_FILTERS = 'SAVE_FILTERS';
export const SAVE_IDS = 'SAVE_IDS';
export const CLEAR_FILTERS = 'CLEAR_FILTERS';
export const CLEAR_FILTERS_ONLY = 'CLEAR_FILTERS_ONLY';
export const SORT_OPTION = 'SORT_OPTION';
export const UPDATE_FILTERS = 'UPDATE_FILTERS';

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

export const updateSortOption = sortOption => {
  return {type: SORT_OPTION, payload: sortOption};
};

export const updateFilters = payload => {
  return {type: UPDATE_FILTERS, payload};
};

export const clearFiltersOnly = () => {
  return {type: CLEAR_FILTERS_ONLY};
};
