import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  orderDetails: null,
  requestingStatus: false,
  requestingTracker: false,
};

const order = createSlice({
  name: 'order',
  initialState,
  reducers: {
    updateOrderDetails(state, action) {
      state.orderDetails = action.payload;
    },
    updateRequestingStatus(state, action) {
      state.requestingStatus = action.payload;
    },
    updateRequestingTracker(state, action) {
      state.requestingTracker = action.payload;
    },
    clearOrder(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: builder => {},
});

export const {
  updateOrderDetails,
  updateRequestingStatus,
  updateRequestingTracker,
  clearOrder,
} = order.actions;
export default order.reducer;
