import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "authorization",
  initialState: {
    token: "",
    isAdmin: true, 
  },
  reducers: {
    setToken: (state, action) => {
      const { token, isAdmin } = action.payload;
      state.token = token;
      state.isAdmin = isAdmin;
    },
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
