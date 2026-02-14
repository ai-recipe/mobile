import { fetchProgressData } from "@/api/progress";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  startDate: "",
  endDate: "",
  progressData: [],
  isProgressDataLoading: false,
};

export const fetchProgressDataAsync = createAsyncThunk(
  "progress/fetchProgressData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchProgressData();
      return response.data?.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Progress data not found",
      );
    }
  },
);

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    setSelectedDate(state, action) {
      state.selectedDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProgressDataAsync.pending, (state) => {
      state.isProgressDataLoading = true;
    });
    builder.addCase(fetchProgressDataAsync.fulfilled, (state, action) => {
      state.progressData = action.payload;
      state.isProgressDataLoading = false;
    });
    builder.addCase(fetchProgressDataAsync.rejected, (state) => {
      state.isProgressDataLoading = false;
    });
  },
});

export default progressSlice.reducer;
