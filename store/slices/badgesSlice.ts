import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchMyBadges, type BadgeListItem } from "@/api/badges";

interface BadgesState {
  items: BadgeListItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: BadgesState = {
  items: [],
  status: "idle",
};

export const fetchMyBadgesAsync = createAsyncThunk(
  "badges/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchMyBadges();
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.error?.code ?? "UNKNOWN");
    }
  },
);

const badgesSlice = createSlice({
  name: "badges",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBadgesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyBadgesAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMyBadgesAsync.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default badgesSlice.reducer;
