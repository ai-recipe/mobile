import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  mealModalOpen: boolean;
  softPaywallOpen: boolean;
  purchaseSuccessOpen: boolean;
}

const initialState: ModalState = {
  mealModalOpen: false,
  softPaywallOpen: false,
  purchaseSuccessOpen: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openMealModal: (state) => {
      state.mealModalOpen = true;
    },
    closeMealModal: (state) => {
      state.mealModalOpen = false;
    },
    openSoftPaywall: (state) => {
      state.softPaywallOpen = true;
    },
    closeSoftPaywall: (state) => {
      state.softPaywallOpen = false;
    },
    openPurchaseSuccess: (state) => {
      state.purchaseSuccessOpen = true;
    },
    closePurchaseSuccess: (state) => {
      state.purchaseSuccessOpen = false;
    },
  },
});

export const {
  openMealModal,
  closeMealModal,
  openSoftPaywall,
  closeSoftPaywall,
  openPurchaseSuccess,
  closePurchaseSuccess,
} = modalSlice.actions;
export default modalSlice.reducer;
