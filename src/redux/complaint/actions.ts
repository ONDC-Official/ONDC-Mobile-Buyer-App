export const SET_COMPLAINT: string = 'SET_COMPLAINT';

export const updateComplaint = (payload: any) => {
  return {type: SET_COMPLAINT, payload};
};
