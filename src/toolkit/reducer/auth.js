import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  token: null,
  uid: null,
  emailId: null,
  name: null,
  photoURL: null,
  language: 'en',
  isLoading: true, // Assuming isLoading should be part of the initial state.
  transaction_id: null, // Assuming transaction_id should be part of the initial state.
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginDetails(state, action) {
      state.token = action.payload.token;
      state.emailId = action.payload.emailId;
      state.uid = action.payload.uid;
      state.name = action.payload.name;
      state.photoURL = action.payload.photoURL;
      state.transaction_id = action.payload.transaction_id;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setTransactionId(state, action) {
      state.transaction_id = action.payload;
    },
    updateLanguage(state, action) {
      state.language = action.payload;
    },
    hideLoader(state) {
      state.isLoading = false;
    },
    logoutUser(state) {
      Object.assign(state, initialState);
    },
    saveUser(state, action) {
      return action.payload;
    },
  },
});

export const {
  setLoginDetails,
  setToken,
  setTransactionId,
  updateLanguage,
  hideLoader,
  logoutUser,
  saveUser,
} = authSlice.actions;
export default authSlice.reducer;
