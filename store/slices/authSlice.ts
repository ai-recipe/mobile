import AuthService from "@/api/auth";
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

interface AuthState {
  user: User | null;
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
  error: string | null;
}

const initialState: AuthState = {
  user: null,
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
  error: null,
};

export const initDeviceAsync = createAsyncThunk(
  "auth/initDevice",
  async (_, { rejectWithValue }) => {
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
        deviceId,
        platform: Platform.OS,
        appVersion: "1.0.0",
      });
      await AsyncStorage.setItem("token", response.data?.data?.anonymousToken);
      return response.data?.data;
    } catch (error: any) {
      console.log("error", error?.response?.data?.message);
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
      AsyncStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initDeviceAsync.pending, (state) => {
        state.isInitDeviceLoading = true;
      })
      .addCase(initDeviceAsync.fulfilled, (state, action) => {
        console.log(
          "initDeviceAsync.fulfilled",
          JSON.stringify(action.payload),
        );
        state.creditGrantType = action.payload?.grantType;
        state.creditRemaining = action.payload?.credits?.remaining;
        //
        state.isNewUser = action.payload?.isNewUser;
        state.isNewDevice = action.payload?.isNewDevice;
        //
        state.user = action.payload?.user;
        state.token = action.payload?.anonymousToken;
        //
        state.isAuthenticated = true;
        state.isInitDeviceLoading = false;
      })
      .addCase(initDeviceAsync.rejected, (state) => {
        state.isAuthenticated = false;
        state.isInitDeviceLoading = false;
      });
  },
});

export const { logout, setIsOnboarded, setAuthenticated } = authSlice.actions;

export default authSlice.reducer;
