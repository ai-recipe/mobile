import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  mealModalOpen: boolean;
  softPaywallOpen: boolean;
}

const initialState: ModalState = {
  mealModalOpen: false,
  softPaywallOpen: false,
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
  },
});

export const { openMealModal, closeMealModal, openSoftPaywall, closeSoftPaywall } = modalSlice.actions;
export default modalSlice.reducer;
