import { configureStore } from "@reduxjs/toolkit";
import configAppSlice from "./configAppSlice";

export const store = configureStore({
  reducer: {
    configApp: configAppSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
