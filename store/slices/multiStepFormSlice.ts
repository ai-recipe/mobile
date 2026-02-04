import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MultiStepFormState {
  currentStep: number;
  totalSteps: number;
  submittedSteps: Record<string, boolean>;
}

const initialState: MultiStepFormState = {
  currentStep: 0,
  totalSteps: 0,
  submittedSteps: {},
};

export const multiStepFormSlice = createSlice({
  name: "multiStepForm",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps - 1) {
        state.currentStep += 1;
      }
    },
    prevStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },
    setTotalSteps: (state, action: PayloadAction<number>) => {
      state.totalSteps = action.payload;
    },
    markStepAsSubmitted: (state, action: PayloadAction<string>) => {
      state.submittedSteps[action.payload] = true;
    },
    clearMultistepFormState: (state) => {
      state.currentStep = 0;
      state.totalSteps = 0;
      state.submittedSteps = {};
    },
  },
});

export const {
  setStep,
  nextStep,
  prevStep,
  setTotalSteps,
  markStepAsSubmitted,
  clearMultistepFormState,
} = multiStepFormSlice.actions;

export default multiStepFormSlice.reducer;
