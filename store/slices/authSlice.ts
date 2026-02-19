import AuthService from "@/api/auth";
import SurveyService from "@/api/survey";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as Application from "expo-application";
import { Platform } from "react-native";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface UserPreferences {
  dietType: string;
  allergens: string[];
  preferredIngredients: string[];
  maxCookTime: number;
  skillLevel: string;
  spicePreference: string;
  goals: string[];
  servingSize: string;
  cuisinePreferences: string[];
  ingredientInputPreference: string;
  missingIngredientTolerance: string;
  completedAt: any;
}

interface SurveyOption {
  icon: string;
  label: string;
  value: string;
}

interface SurveyQuestion {
  key: string;
  title: string;
  type: "single_select" | "multi_select" | "number_input";
  options: SurveyOption[];
  isRequired: boolean;
}

interface AuthState {
  user: User | null;
  preferences: UserPreferences | null;
  surveyQuestions: SurveyQuestion[];
  isAuthenticated: boolean;
  token: string | null;
  creditGrantType: string | null;
  creditRemaining: number | null;
  isNewUser: boolean;
  isNewDevice: boolean;
  isOnboarded: boolean;
  isOnboardingStateLoaded: boolean;
  isLoginLoading: boolean;
  isRegisterLoading: boolean;
  isInitDeviceLoading: boolean;
  isPreferencesLoading: boolean;
  isSurveyQuestionsLoading: boolean;
  isSurveySubmitting: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  preferences: null,
  surveyQuestions: [],
  isAuthenticated: false,
  token: null,
  creditGrantType: null,
  creditRemaining: null,
  isNewUser: false,
  isNewDevice: false,
  isOnboarded: false,
  isOnboardingStateLoaded: false,
  isLoginLoading: false,
  isRegisterLoading: false,
  isInitDeviceLoading: false,
  isPreferencesLoading: false,
  isSurveyQuestionsLoading: false,
  isSurveySubmitting: false,
  error: null,
};

export const fetchUserPreferencesAsync = createAsyncThunk(
  "auth/fetchUserPreferences",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await SurveyService.getUserPreferencesAPI();
      if (!response.data?.data || true) {
        // todo
        dispatch(fetchSurveyQuestionsAsync());
      }
      return response.data?.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Tercihler yüklenemedi",
      );
    }
  },
);

export const fetchSurveyQuestionsAsync = createAsyncThunk(
  "auth/fetchSurveyQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await SurveyService.getSurveyQuestionsAPI();
      return response.data?.data?.questions;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Anket soruları yüklenemedi",
      );
    }
  },
);

export const submitSurveyAsync = createAsyncThunk(
  "auth/submitSurvey",
  async (responses: any, { dispatch, rejectWithValue }) => {
    try {
      console.log("responses", JSON.stringify(responses, null, 2));
      const response = await SurveyService.submitSurveyAPI({ responses });
      console.log("response", JSON.stringify(response.data, null, 2));
      await dispatch(fetchUserPreferencesAsync());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Anket gönderilemedi",
      );
    }
  },
);

export const initDeviceAsync = createAsyncThunk(
  "auth/initDevice",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      let deviceId: string;
      if (Platform.OS === "ios") {
        deviceId = (await Application.getIosIdForVendorAsync()) || "unknown";
      } else if (Platform.OS === "android") {
        deviceId = Application.getAndroidId() || "unknown";
      } else {
        deviceId = "unknown";
      }

      const response = await AuthService.initDeviceAPI({
        deviceId: "allah",
        platform: Platform.OS,
        appVersion: "1.0.0",
      });
      const data = response.data?.data;
      await AsyncStorage.setItem("token", data?.anonymousToken);

      // Dispatch preferences after init completes
      await dispatch(fetchUserPreferencesAsync());

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Cihaz başlatma başarısız",
      );
    }
  },
);

export const registerWithEmailAsync = createAsyncThunk(
  "auth/registerWithEmail",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await AuthService.registerWithEmailAPI(data);
      const { token, user } = response.data;
      await AsyncStorage.setItem("token", token);
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Kayıt başarısız",
      );
    }
  },
);

export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.logoutAPI();
      await AsyncStorage.removeItem("token");
    } catch (error: any) {
      // Even if API fails, we should clear local token
      await AsyncStorage.removeItem("token");
      return rejectWithValue(
        error.response?.data?.message || "Çıkış yapılırken bir hata oluştu",
      );
    }
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsOnboarded: (state, action: PayloadAction<boolean>) => {
      state.isOnboarded = action.payload;
      state.isOnboardingStateLoaded = true;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.preferences = null;
      AsyncStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Init Device
      .addCase(initDeviceAsync.pending, (state) => {
        state.isInitDeviceLoading = true;
      })
      .addCase(initDeviceAsync.fulfilled, (state, action) => {
        state.creditGrantType = action.payload?.grantType;
        state.creditRemaining = action.payload?.credits?.remaining;
        state.isNewUser = action.payload?.isNewUser;
        state.isNewDevice = action.payload?.isNewDevice;
        state.user = action.payload?.user;
        state.token = action.payload?.anonymousToken;
        state.isAuthenticated = true;
        state.isInitDeviceLoading = false;
      })
      .addCase(initDeviceAsync.rejected, (state) => {
        state.isAuthenticated = false;
        state.isInitDeviceLoading = false;
      })
      // User Preferences
      .addCase(fetchUserPreferencesAsync.pending, (state) => {
        state.isPreferencesLoading = true;
      })
      .addCase(fetchUserPreferencesAsync.fulfilled, (state, action) => {
        state.preferences = action.payload;
        state.isPreferencesLoading = false;
      })
      .addCase(fetchUserPreferencesAsync.rejected, (state) => {
        state.isPreferencesLoading = false;
      })
      // Survey Questions
      .addCase(fetchSurveyQuestionsAsync.pending, (state) => {
        state.isSurveyQuestionsLoading = true;
      })
      .addCase(fetchSurveyQuestionsAsync.fulfilled, (state, action) => {
        state.surveyQuestions = action.payload;
        state.isSurveyQuestionsLoading = false;
      })
      .addCase(fetchSurveyQuestionsAsync.rejected, (state) => {
        state.isSurveyQuestionsLoading = false;
      })
      // Submit Survey
      .addCase(submitSurveyAsync.pending, (state) => {
        state.isSurveySubmitting = true;
      })
      .addCase(submitSurveyAsync.fulfilled, (state) => {
        state.isSurveySubmitting = false;
      })
      .addCase(submitSurveyAsync.rejected, (state) => {
        state.isSurveySubmitting = false;
      });
  },
});

export const { logout, setIsOnboarded, setAuthenticated } = authSlice.actions;

export default authSlice.reducer;
