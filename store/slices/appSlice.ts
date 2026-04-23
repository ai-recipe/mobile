import i18n from "@/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as Localization from "expo-localization";

interface AppState {
  isLoading: boolean;
  currentLanguage: string;
  isAppInitialized: boolean;
}

const initialState: AppState = {
  isLoading: true,
  isAppInitialized: false,
  currentLanguage: "en",
};

export const initAppAsync = createAsyncThunk("app/initApp", async () => {
  const language = await AsyncStorage.getItem("CURRENT_LANGUAGE");
  const locale = language ?? Localization.getLocales()[0].languageCode ?? "en";
  i18n.changeLanguage(locale);
  return { locale };
});

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
  extraReducers: (builder) => {
    builder.addCase(initAppAsync.fulfilled, (state, action) => {
      state.currentLanguage = action.payload.locale;
      state.isAppInitialized = true;
    });
  },
});

export const { setIsLoading, setCurrentLanguage } = appSlice.actions;

export default appSlice.reducer;
