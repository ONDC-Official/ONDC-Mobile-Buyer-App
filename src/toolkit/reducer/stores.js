import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  locations: [],
};

const stores = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    saveStoresList(state, action) {
      state.locations = action.payload;
    },
    clearStoresList(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: builder => {},
});

export const {saveStoresList, clearStoresList} = stores.actions;
export default stores.reducer;
