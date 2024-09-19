import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  wishlistItems: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    updateWishlistItems(state, action) {
      state.wishlistItems = action.payload;
    },
    clearWishlist(state) {
      return initialState;
    },
  },
});

export const {updateWishlistItems, clearWishlist} = wishlistSlice.actions;
export default wishlistSlice.reducer;
