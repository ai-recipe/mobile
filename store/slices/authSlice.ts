import AuthService from "@/api/auth";
import SurveyService from "@/api/survey";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as Application from "expo-application";
import { router } from "expo-router";
import { Platform } from "react-native";

interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  userType?: string;
  createdAt?: string;
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
  type: "single" | "multiple" | "number";
  options: SurveyOption[];
  isRequired: boolean;
}

interface AuthState {
  user: User | null;
  preferences: UserPreferences | null;
  surveyQuestions: SurveyQuestion[];
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  creditGrantType: string | null;
  creditRemaining: number | null;
  scanLimit: number | null;
  scanTier: string | null;
  isNewUser: boolean;
  isNewDevice: boolean;
  isOnboarded: boolean;
  isOnboardingStateLoaded: boolean;
  isLoginLoading: boolean;
  isRegisterLoading: boolean;
  isGoogleLoading: boolean;
  isAppleLoading: boolean;
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
  accessToken: null,
  refreshToken: null,
  creditGrantType: null,
  creditRemaining: null,
  scanLimit: null,
  scanTier: null,
  isNewUser: false,
  isNewDevice: false,
  isOnboarded: false,
  isOnboardingStateLoaded: false,
  isLoginLoading: false,
  isRegisterLoading: false,
  isGoogleLoading: false,
  isAppleLoading: false,
  isInitDeviceLoading: false,
  isPreferencesLoading: false,
  isSurveyQuestionsLoading: false,
  isSurveySubmitting: false,
  error: null,
};
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  forceCodeForRefreshToken: true,
});
export const fetchUserPreferencesAsync = createAsyncThunk(
  "auth/fetchUserPreferences",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await SurveyService.getUserPreferencesAPI();
      dispatch(fetchSurveyQuestionsAsync());
      dispatch(fetchUserAsync());

      if (!response.data?.data) {
        router.push("/screens/survey");
        return null;
      } else {
        router.push("(protected)/(tabs)");
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
      return response.data?.data || [];
    } catch (error: any) {
      console.log("error", error);
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
      const response = await SurveyService.submitSurveyAPI({ responses });
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
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);
      if (accessToken && refreshToken) {
        await dispatch(fetchUserPreferencesAsync());

        return { accessToken, refreshToken };
      }
      let deviceId: string;
      if (Platform.OS === "ios") {
        deviceId = (await Application.getIosIdForVendorAsync()) || "unknown";
      } else if (Platform.OS === "android") {
        deviceId = Application.getAndroidId() || "unknown";
      } else {
        deviceId = "unknown";
      }
      console.log("deviceId", deviceId);
      const response = await AuthService.initDeviceAPI({
        deviceId,
        platform: Platform.OS,
        appVersion: "1.0.0",
      });
      const isOnboarded = await AsyncStorage.getItem("isOnboarded");
      console.log("isOnboarded", isOnboarded);
      dispatch(setIsOnboarded(isOnboarded === "true" && false));

      const data = response.data?.data;
      if (data?.anonymousToken) {
        await AsyncStorage.setItem("accessToken", data.anonymousToken);
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Cihaz başlatma başarısız",
      );
    }
  },
);

export const loginWithEmailAsync = createAsyncThunk(
  "auth/loginWithEmail",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await AuthService.loginWithEmailAPI(data);
      const { accessToken, refreshToken, user } = response.data.data;
      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      return { accessToken, refreshToken, user };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error?.message || "Giriş başarısız",
      );
    }
  },
);

export const registerWithEmailAsync = createAsyncThunk(
  "auth/registerWithEmail",
  async (data: any, { rejectWithValue, dispatch }) => {
    try {
      console.log("data", data);
      const response = await AuthService.registerWithEmailAPI(data);
      console.log("response", response);
      const { accessToken, refreshToken, user } = response.data.data;
      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      await dispatch(fetchUserPreferencesAsync());
      return { accessToken, refreshToken, user };
    } catch (error: any) {
      console.log("error", JSON.stringify(error, null, 2));
      return rejectWithValue(
        error.response?.data?.error?.message || "Kayıt başarısız",
      );
    }
  },
);

export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.logoutAPI();
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
    } catch (error: any) {
      // Even if API fails, we should clear local token
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      return rejectWithValue(
        error.response?.data?.message || "Çıkış yapılırken bir hata oluştu",
      );
    }
  },
);

export const loginWithGoogleAsync = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      console.log(
        "GoogleSignin",
        JSON.stringify(process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, null, 2),
      );

      const response = (await GoogleSignin.signIn({})) as any;
      const googleResponse = await AuthService.loginWithGoogleAPI({
        idToken: response.data.idToken,
      });
      await AsyncStorage.setItem(
        "accessToken",
        googleResponse.data.data.accessToken,
      );
      await AsyncStorage.setItem(
        "refreshToken",
        googleResponse.data.data.refreshToken,
      );

      await dispatch(fetchUserPreferencesAsync());

      return googleResponse.data?.data;
    } catch (error: any) {
      console.log("error", JSON.stringify(error, null, 2));
      return rejectWithValue(
        error.response?.data?.error?.message ||
          error.message ||
          "Google sign-in failed",
      );
    }
  },
);

export const loginWithAppleAsync = createAsyncThunk(
  "auth/loginWithApple",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const AppleAuthentication = await import("expo-apple-authentication");
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (!credential.identityToken) {
        return rejectWithValue(
          "Apple sign-in did not return an identity token",
        );
      }
      const apiResponse = await AuthService.loginWithAppleAPI({
        identityToken: credential.identityToken,
        fullName: credential.fullName
          ? {
              givenName: credential.fullName.givenName ?? undefined,
              familyName: credential.fullName.familyName ?? undefined,
            }
          : undefined,
        email: credential.email ?? undefined,
      });

      const { accessToken, refreshToken, user } = apiResponse.data.data;
      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      await dispatch(fetchUserPreferencesAsync());

      return { accessToken, refreshToken, user };
    } catch (error: any) {
      if (error.code === "ERR_REQUEST_CANCELED") {
        return rejectWithValue("cancelled");
      }
      return rejectWithValue(
        error.response?.data?.error?.message ||
          error.message ||
          "Apple sign-in failed",
      );
    }
  },
);

export const fetchQuotaAsync = createAsyncThunk(
  "auth/fetchQuota",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.fetchQuotaAPI();
      return response.data?.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Kota bilgisi alınamadı",
      );
    }
  },
);

export const fetchUserAsync = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.getUserAPI();
      return response.data?.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Kullanıcı bilgisi alınamadı",
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
    decrementCredit: (state) => {
      if (state.creditRemaining !== null && state.creditRemaining > 0) {
        state.creditRemaining -= 1;
      }
    },
    setRemainingScans: (
      state,
      action: PayloadAction<{
        remaining: number | null;
        limit: number | null;
        tier: string | null;
      }>,
    ) => {
      state.creditRemaining = action.payload.remaining;
      state.scanLimit = action.payload.limit;
      state.scanTier = action.payload.tier;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.preferences = null;
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
        state.creditRemaining = action.payload?.credits ?? null;
        state.scanLimit = action.payload?.scanLimit ?? null;
        state.scanTier = action.payload?.tier ?? null;
        state.isNewUser = action.payload?.isNewUser;
        state.isNewDevice = action.payload?.isNewDevice;
        state.user = action.payload?.user;
        state.accessToken = action.payload?.anonymousToken;
        state.refreshToken = action.payload?.refreshToken;
        state.isAuthenticated = action.payload?.refreshToken ? true : false;
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
      })
      // Fetch Quota
      .addCase(fetchQuotaAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.creditRemaining = action.payload.remaining ?? null;
          state.scanLimit = action.payload.limit ?? null;
          state.scanTier = action.payload.tier ?? null;
        }
      })
      // Fetch User
      .addCase(fetchUserAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = { ...state.user, ...action.payload };
        }
      })
      // Login with Email
      .addCase(loginWithEmailAsync.pending, (state) => {
        state.isLoginLoading = true;
        state.error = null;
      })
      .addCase(loginWithEmailAsync.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.isLoginLoading = false;
        state.error = null;
      })
      .addCase(loginWithEmailAsync.rejected, (state, action) => {
        state.isLoginLoading = false;
        state.error = action.payload as string;
      })
      // Register with Email
      .addCase(registerWithEmailAsync.pending, (state) => {
        state.isRegisterLoading = true;
        state.error = null;
      })
      .addCase(registerWithEmailAsync.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.isRegisterLoading = false;
        state.error = null;
      })
      .addCase(registerWithEmailAsync.rejected, (state, action) => {
        state.isRegisterLoading = false;
        state.error = action.payload as string;
      })
      // Login with Google
      .addCase(loginWithGoogleAsync.pending, (state) => {
        state.isGoogleLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogleAsync.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.isGoogleLoading = false;
        state.error = null;
      })
      .addCase(loginWithGoogleAsync.rejected, (state, action) => {
        state.isGoogleLoading = false;
        state.error = action.payload as string;
      })
      // Login with Apple
      .addCase(loginWithAppleAsync.pending, (state) => {
        state.isAppleLoading = true;
        state.error = null;
      })
      .addCase(loginWithAppleAsync.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.isAppleLoading = false;
        state.error = null;
      })
      .addCase(loginWithAppleAsync.rejected, (state, action) => {
        state.isAppleLoading = false;
        if (action.payload !== "cancelled") {
          state.error = action.payload as string;
        }
      })
      // Logout
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.preferences = null;
        state.error = null;
        router.replace("/(public)/screens/login");
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.preferences = null;
        state.error = null;
      });
  },
});

export const {
  logout,
  setIsOnboarded,
  setAuthenticated,
  decrementCredit,
  setRemainingScans,
} = authSlice.actions;

export default authSlice.reducer;
