export const CLEAR_CART: string = 'CLEAR_CART';
export const CLEAR_DATA: string = 'CLEAR_DATA';

export const clearAllData = () => {
  return {type: CLEAR_DATA, payload: null};
};

export const clearCart = () => {
  return {type: CLEAR_CART, payload: null};
};
