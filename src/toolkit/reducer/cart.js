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
    clearSpecificCart(state, action) {
      state.cartItems = state.cartItems.filter(
        item => item._id !== action.payload,
      );
    },
    clearCart(state) {
      return initialState;
    },
    clearData(state) {
      return initialState;
    },
  },
});

export const {updateCartItems, clearCart, clearData, clearSpecificCart} =
  cartSlice.actions;
export default cartSlice.reducer;
