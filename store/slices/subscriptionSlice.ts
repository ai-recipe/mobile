import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubscriptionState {
  isLoading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  isLoading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setIsLoading } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
