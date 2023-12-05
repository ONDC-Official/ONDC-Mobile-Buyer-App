export const SET_ADDRESS: string = 'SET_ADDRESS';

export const saveAddress = (address: any) => {
  return {type: SET_ADDRESS, payload: address};
};
