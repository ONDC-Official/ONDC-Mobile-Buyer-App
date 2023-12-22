export const SET_CART_ITEMS: string = 'SET_CART_ITEMS';

export const updateCartItems = (items: any[]) => {
  return {type: SET_CART_ITEMS, payload: items};
};
