import { THEME_STORAGE_KEY } from "@/hooks/useInitApp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemePreference = "light" | "dark" | "system";

interface UIState {
  theme: ThemePreference;
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
    setTheme: (state, action: PayloadAction<ThemePreference>) => {
      state.theme = action.payload;
      AsyncStorage.setItem(THEME_STORAGE_KEY, action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setTheme, setLoading } = uiSlice.actions;

export default uiSlice.reducer;
