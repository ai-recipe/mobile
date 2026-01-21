import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  isOnboarded: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initDevice: (state) => {
      state.isAuthenticated = true;
    },
    setIsOnboarded: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      state.isOnboarded = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const { logout, setIsOnboarded } = authSlice.actions;

export default authSlice.reducer;
