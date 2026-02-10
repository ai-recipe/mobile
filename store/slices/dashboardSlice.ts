import { fetchDashboardData } from "@/api/dashboard";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedDate: new Date(),
  dashboardData: [],
  isDashboardDataLoading: false,
};

export const fetchDashboardDataAsync = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { getState }) => {
    const selectedDate = (getState() as any).dashboard.selectedDate;
    const response = await fetchDashboardData(selectedDate);
    return response.data?.data;
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSelectedDate(state, action) {
      state.selectedDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDashboardDataAsync.pending, (state) => {
      state.isDashboardDataLoading = true;
    });
    builder.addCase(fetchDashboardDataAsync.fulfilled, (state, action) => {
      state.dashboardData = action.payload;
      state.isDashboardDataLoading = false;
    });
    builder.addCase(fetchDashboardDataAsync.rejected, (state) => {
      state.isDashboardDataLoading = false;
    });
  },
});

export default dashboardSlice.reducer;
