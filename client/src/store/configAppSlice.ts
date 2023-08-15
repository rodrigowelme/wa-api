import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const themes = ["dark", "light", "cupcake"];

export interface Config {
  theme: "dark" | "light" | "cupcake";
}

export const initialState: Config = {
  theme: "light",
};

const root = document.getElementById("root");

export const configAppSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    changeTheme: (state, { payload }: PayloadAction<Config>) => {
      root?.setAttribute("data-theme", payload.theme);
      return { ...state, ...payload };
    },
  },
});
export const { changeTheme } = configAppSlice.actions;

export const configApp = (state: RootState): Config => state.configApp;

export default configAppSlice.reducer;
