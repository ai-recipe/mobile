import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  isLoading: boolean;
  currentLanguage: string;
}

const initialState: AppState = {
  isLoading: false,
  currentLanguage: "en",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCurrentLanguage: (state, action: PayloadAction<string>) => {
      state.currentLanguage = action.payload;
    },
  },
});

export const { setIsLoading, setCurrentLanguage } = appSlice.actions;

export default appSlice.reducer;
