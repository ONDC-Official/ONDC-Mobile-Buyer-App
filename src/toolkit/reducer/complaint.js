import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  complaintDetails: null,
};

const Complaint = createSlice({
  name: 'Complaint',
  initialState,
  reducers: {
    updateComplaint(state, action) {
      state.complaintDetails = action.payload;
    },
    clearComplaint(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: builder => {},
});

export const {updateComplaint, clearComplaint} = Complaint.actions;
export default Complaint.reducer;
