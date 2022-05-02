export const ADD_PRODUCT_CART = 'ADD_PRODUCT_CART';
export const REMOVE_PRODUCT_CART = 'REMOVE_PRODUCT_CART';
export const UPDATE_PRODUCT_CART = 'UPDATE_PRODUCT_CART';
export const CLEAR_CART = 'CLEAR_CART';
export const CLEAR_DATA = 'CLEAR_DATA';

export const clearAllData = () => {
  return {type: CLEAR_DATA, payload: null};
};

export const addItemToCart = product => {
  return {type: ADD_PRODUCT_CART, payload: product};
};

export const removeItemFromCart = product => {
  return {type: REMOVE_PRODUCT_CART, payload: product};
};

export const updateItemInCart = product => {
  return {type: UPDATE_PRODUCT_CART, payload: product};
};

export const clearCart = () => {
  return {type: CLEAR_CART, payload: null};
};

