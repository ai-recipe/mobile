import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  isLoading: boolean;
}

const initialState: AppState = {
  isLoading: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setIsLoading } = appSlice.actions;

export default appSlice.reducer;
