import i18n from "@/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as Localization from "expo-localization";

export const initI18n = createAsyncThunk("app/initI18n", async () => {
  const deviceLanguage = Localization.getLocales()[0].languageCode ?? "en";
  const storedLanguage = await AsyncStorage.getItem("CURRENT_LANGUAGE");
  const finalLanguage = storedLanguage || deviceLanguage;

  await i18n.changeLanguage(finalLanguage);
  return finalLanguage;
});

interface AppState {
  isLoading: boolean;
  currentLanguage: string | null;
}

const initialState: AppState = {
  isLoading: false,
  currentLanguage: null,
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
  extraReducers: (builder) => {
    builder.addCase(initI18n.fulfilled, (state, action) => {
      state.currentLanguage = action.payload;
    });
  },
});

export const { setIsLoading, setCurrentLanguage } = appSlice.actions;

export default appSlice.reducer;
