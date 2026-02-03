import SurveyService from "@/api/survey";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface SurveyState {
  isSubmitLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: SurveyState = {
  isSubmitLoading: false,
  isSuccess: false,
  error: null,
};

export const submitSurveyAsync = createAsyncThunk(
  "survey/submit",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await SurveyService.submitSurveyAPI(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Anket gönderimi başarısız oldu",
      );
    }
  },
);

export const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
    resetSurveyStatus: (state) => {
      state.isSubmitLoading = false;
      state.isSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitSurveyAsync.pending, (state) => {
        state.isSubmitLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(submitSurveyAsync.fulfilled, (state) => {
        state.isSubmitLoading = false;
        state.isSuccess = true;
        state.error = null;
      })
      .addCase(submitSurveyAsync.rejected, (state, action) => {
        state.isSubmitLoading = false;
        state.isSuccess = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetSurveyStatus } = surveySlice.actions;

export default surveySlice.reducer;
