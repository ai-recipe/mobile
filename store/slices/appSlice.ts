import i18n from "@/i18n";
import { fetchTranslationsAPI } from "@/api/translations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as Localization from "expo-localization";

export const initI18n = createAsyncThunk("app/initI18n", async () => {
  const deviceLanguage = Localization.getLocales()[0].languageCode ?? "en";
  const storedLanguage = await AsyncStorage.getItem("CURRENT_LANGUAGE");
  const finalLanguage = storedLanguage || deviceLanguage;

  await i18n.changeLanguage(finalLanguage);

  // Fetch remote translations and merge — silently ignored on failure
  try {
    const remote = await fetchTranslationsAPI();
    if (Object.keys(remote).length > 0) {
      i18n.addResourceBundle(finalLanguage, "translation", remote, true, true);
    }
  } catch {
    // fall back to static translations
  }

  return finalLanguage;
});

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
  extraReducers: (builder) => {
    builder.addCase(initI18n.fulfilled, (state, action) => {
      state.currentLanguage = action.payload;
    });
  },
});

export const { setIsLoading, setCurrentLanguage } = appSlice.actions;

export default appSlice.reducer;
