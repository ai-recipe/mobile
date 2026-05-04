import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

export interface BadgePayload {
  _id: string;
  name: string;
  description: string;
  icon: string; // emoji or remote image URL
  rarity: BadgeRarity;
  unlockedAt: string; // ISO date string — safe for Redux serialization
}

interface GamificationState {
  badgeQueue: BadgePayload[];
  isDisplayingBadge: boolean;
}

const initialState: GamificationState = {
  badgeQueue: [],
  isDisplayingBadge: false,
};

const gamificationSlice = createSlice({
  name: "gamification",
  initialState,
  reducers: {
    // Called by the Socket.IO listener in _layout.tsx when badge:unlocked arrives
    badgeReceived(state, action: PayloadAction<BadgePayload>) {
      state.badgeQueue.push(action.payload);
      // Auto-start display if nothing is currently showing
      if (!state.isDisplayingBadge) {
        state.isDisplayingBadge = true;
      }
    },

    // Called after the exit animation completes — advances the queue
    dismissCurrentBadge(state) {
      state.badgeQueue.shift();
      state.isDisplayingBadge = state.badgeQueue.length > 0;
    },
  },
});

export const { badgeReceived, dismissCurrentBadge } =
  gamificationSlice.actions;

export default gamificationSlice.reducer;
