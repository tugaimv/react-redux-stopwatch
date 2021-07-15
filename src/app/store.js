import { configureStore } from "@reduxjs/toolkit";

import timersReducer from "../features/timers/timersSlice";

export default configureStore({
  reducer: {
    timers: timersReducer,
  },
});
