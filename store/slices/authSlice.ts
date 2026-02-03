import AuthService from "@/api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as Application from "expo-application";
import { Platform } from "react-native";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isOnboarded: boolean;
  isLoginLoading: boolean;
  isRegisterLoading: boolean;
  isInitDeviceLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  isOnboarded: false,
  isLoginLoading: false,
  isRegisterLoading: false,
  isInitDeviceLoading: false,
  error: null,
};

export const initDeviceAsync = createAsyncThunk(
  "auth/initDevice",
  async (_, { rejectWithValue }) => {
    try {
      let deviceID: string;
      if (Platform.OS === "ios") {
        deviceID = (await Application.getIosIdForVendorAsync()) || "unknown";
      } else if (Platform.OS === "android") {
        deviceID = Application.getAndroidId() || "unknown";
      } else {
        deviceID = "unknown";
      }

      const response = await AuthService.initDeviceAPI({ deviceID });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Cihaz başlatma başarısız",
      );
    }
  },
);

export const loginWithEmailAsync = createAsyncThunk(
  "auth/loginWithEmail",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await AuthService.loginWithEmailAPI(data);
      const { token, user } = response.data;
      await AsyncStorage.setItem("token", token);
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Giriş başarısız",
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
      console.log("setIsOnboarded", action.payload);
      state.isOnboarded = action.payload;
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
      .addCase(initDeviceAsync.fulfilled, (state) => {
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
