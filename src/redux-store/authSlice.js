import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  email: null,
  token: null,
  user_type: null,
  isVerifiedByAdmin: false,
  registeredEvents: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      const {
        id,
        email,
        token,
        user_type,
        isVerifiedByAdmin,
        registeredEvents,
      } = action.payload;

      console.log("Payload in Reducer:", action.payload);
      state.id = id;
      state.email = email;
      state.token = token;
      state.user_type = user_type;
      state.isVerifiedByAdmin = isVerifiedByAdmin;
      state.registeredEvents = registeredEvents;
    },
    logout(state) {
      state.id = null;
      state.email = null;
      state.token = null;
      state.user_type = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
