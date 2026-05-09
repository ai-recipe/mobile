import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  mealModalOpen: boolean;
  softPaywallOpen: boolean;
  purchaseSuccessOpen: boolean;
  addMealOptionsOpen: boolean;
  foodPickerOpen: boolean;
}

const initialState: ModalState = {
  mealModalOpen: false,
  softPaywallOpen: false,
  purchaseSuccessOpen: false,
  addMealOptionsOpen: false,
  foodPickerOpen: false,
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
    openAddMealOptions: (state) => {
      state.addMealOptionsOpen = true;
    },
    closeAddMealOptions: (state) => {
      state.addMealOptionsOpen = false;
    },
    openFoodPicker: (state) => {
      state.foodPickerOpen = true;
    },
    closeFoodPicker: (state) => {
      state.foodPickerOpen = false;
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
  openAddMealOptions,
  closeAddMealOptions,
  openFoodPicker,
  closeFoodPicker,
} = modalSlice.actions;
export default modalSlice.reducer;
