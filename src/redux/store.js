import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice.js';
import userSlice from './userSlice.js';

export default configureStore ({
  reducer: {
    authorization: authSlice,
    user: userSlice
  }
});