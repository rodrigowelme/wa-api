import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

export const themes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
];

interface Config {
  theme: string;
}

export const initialState = {
  theme: 'light',
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    changeTheme: (state, { payload }: PayloadAction<Config>) => {
      return { ...state, ...payload };
    },
  },
});
export const { changeTheme } = configSlice.actions;

export const config = (state: RootState): Config => state.config;

export default configSlice.reducer;
