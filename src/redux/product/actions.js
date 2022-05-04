export const SAVE_PRODUCTS = 'SAVE_PRODUCTS';

export const saveProducts = products => {
  return {type: SAVE_PRODUCTS, payload: products};
};
