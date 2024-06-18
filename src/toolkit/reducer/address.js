import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  address: null,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddress(state, action) {
      state.address = action.payload;
    },
    clearAddress(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {setAddress, clearAddress} = addressSlice.actions;
export default addressSlice.reducer;
