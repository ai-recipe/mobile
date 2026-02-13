import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  mealModalOpen: boolean;
}

const initialState: ModalState = {
  mealModalOpen: false,
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
  },
});

export const { openMealModal, closeMealModal } = modalSlice.actions;
export default modalSlice.reducer;
