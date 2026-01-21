import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  theme: "light" | "dark" | "system";
  isLoading: boolean;
}

const initialState: UIState = {
  theme: "system",
  isLoading: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setTheme, setLoading } = uiSlice.actions;

export default uiSlice.reducer;
