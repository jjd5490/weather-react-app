import { createSlice } from "@reduxjs/toolkit";
// import db from "../../Database";

const initialState = {
  account: null,
  profile: "12345",
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.account = action.payload;
    },
  },
});

export const { setProfile } = accountSlice.actions;
export default accountSlice.reducer;
