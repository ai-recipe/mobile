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
      });
  },
});

export const { logout, setIsOnboarded } = authSlice.actions;

export default authSlice.reducer;
