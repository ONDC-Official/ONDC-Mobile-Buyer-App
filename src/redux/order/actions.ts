export const SET_ORDER_DETAILS: string = 'SET_ORDER_DETAILS';
export const REQUESTING_STATUS: string = 'REQUESTING_STATUS';
export const REQUESTING_TRACKER: string = 'REQUESTING_TRACKER';

export const updateOrderDetails = (payload: any) => {
  return {type: SET_ORDER_DETAILS, payload};
};

export const updateRequestingStatus = (payload: any) => {
  return {type: REQUESTING_STATUS, payload};
};

export const updateRequestingTracker = (payload: any) => {
  return {type: REQUESTING_TRACKER, payload};
};
