import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  categories: null,
};

const Categories = createSlice({
  name: 'Categories',
  initialState,
  reducers: {
    updateCategories(state, action) {
      state.categories = action.payload;
    },
  },
  extraReducers: builder => {},
});

export const {updateCategories} = Categories.actions;
export default Categories.reducer;
