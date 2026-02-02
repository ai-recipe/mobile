import AuthService from "@/api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  isOnboarded: false,
  isLoginLoading: false,
  isRegisterLoading: false,
  error: null,
};

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
    initDevice: (state) => {
      state.isAuthenticated = true;
    },
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
      .addCase(loginWithEmailAsync.pending, (state) => {
        state.isLoginLoading = true;
        state.error = null;
      })
      .addCase(loginWithEmailAsync.fulfilled, (state, action) => {
        state.isLoginLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginWithEmailAsync.rejected, (state, action) => {
        state.isLoginLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerWithEmailAsync.pending, (state) => {
        state.isRegisterLoading = true;
        state.error = null;
      })
      .addCase(registerWithEmailAsync.fulfilled, (state, action) => {
        state.isRegisterLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(registerWithEmailAsync.rejected, (state, action) => {
        state.isRegisterLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        // We still clear state on logout error because local token is removed
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setIsOnboarded, setAuthenticated } = authSlice.actions;

export default authSlice.reducer;
