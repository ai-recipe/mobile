import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import SubscriptionService, {
  type SubscriptionStatus,
} from "@/api/subscription";

// ─── State ────────────────────────────────────────────────────────────────────

interface SubscriptionState {
  data: SubscriptionStatus | null;
  isLoading: boolean;
  isPurchasing: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  data: null,
  isLoading: false,
  isPurchasing: false,
  error: null,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchSubscriptionStatus = createAsyncThunk(
  "subscription/fetchStatus",
  async (_, { rejectWithValue }) => {
    try {
      const res = await SubscriptionService.getStatus();
      console.log("res", res.data);
      return res.data.subscription;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.error?.message ?? "Failed to load subscription",
      );
    }
  },
);

export const activateGooglePlayPurchase = createAsyncThunk(
  "subscription/activateGooglePlay",
  async (
    payload: {
      purchaseToken: string;
      basePlanId: "monthly" | "yearly";
      packageName?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await SubscriptionService.activateGooglePlay(payload);
      return res.data.subscription;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.error?.message ??
          "Failed to activate subscription",
      );
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    clearSubscriptionError(state) {
      state.error = null;
    },
    setIsPurchasing(state, action: PayloadAction<boolean>) {
      state.isPurchasing = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchSubscriptionStatus
    builder
      .addCase(fetchSubscriptionStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchSubscriptionStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // activateGooglePlayPurchase
    builder
      .addCase(activateGooglePlayPurchase.pending, (state) => {
        state.isPurchasing = true;
        state.error = null;
      })
      .addCase(activateGooglePlayPurchase.fulfilled, (state, action) => {
        state.isPurchasing = false;
        state.data = action.payload;
      })
      .addCase(activateGooglePlayPurchase.rejected, (state, action) => {
        state.isPurchasing = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSubscriptionError, setIsPurchasing } =
  subscriptionSlice.actions;
export default subscriptionSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────

import type { RootState } from "@/store";

function isActiveProOrTrial(data: SubscriptionStatus | null): boolean {
  if (!data) return false;
  if (data.tier !== "pro" && data.tier !== "trial") return false;
  if (!data.isActive) return false;
  if (data.currentPeriodEnd && new Date(data.currentPeriodEnd) <= new Date())
    return false;
  return true;
}

/** True when the user should see paywall banners / upgrade prompts. */
export const selectShouldShowPaywallBanners = (state: RootState): boolean =>
  !isActiveProOrTrial(state.subscription.data);

/** True when the user has an active pro or trial subscription. */
export const selectIsProActive = (state: RootState): boolean =>
  isActiveProOrTrial(state.subscription.data);
