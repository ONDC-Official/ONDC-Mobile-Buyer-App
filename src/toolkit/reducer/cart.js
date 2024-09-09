import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateCartItems(state, action) {
      state.cartItems = action.payload;
    },
    clearCart(state) {
      return initialState;
    },
  },
});

export const {updateCartItems, clearCart} = cartSlice.actions;
export default cartSlice.reducer;
