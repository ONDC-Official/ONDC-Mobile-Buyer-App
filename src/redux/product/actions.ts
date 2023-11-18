export const SAVE_PRODUCTS = 'SAVE_PRODUCTS';
export const CLEAR_PRODUCTS = 'CLEAR_PRODUCTS';

export const saveProducts = (products: any) => {
  return {type: SAVE_PRODUCTS, payload: products};
};

export const clearProducts = () => {
  return {type: CLEAR_PRODUCTS, payload: null};
};
