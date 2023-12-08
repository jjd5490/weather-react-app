import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../account-state/accountReducer";

const store = configureStore({
  reducer: {
    accountReducer,
  },
});

export default store;
