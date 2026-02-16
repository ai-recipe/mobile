import UserService, { PersonalDetails } from "@/api/user";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  personalDetails: PersonalDetails | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: UserState = {
  personalDetails: {
    goalWeight: 0,
    currentWeight: 0,
    height: 0,
    dateOfBirth: "",
    gender: "",
    dailyCalorieGoal: 0,
    dailyProteinGoal: 0,
    dailyCarbGoal: 0,
    dailyFatGoal: 0,
  },
  isLoading: false,
  isUpdating: false,
  error: null,
};

export const getPersonalDetailsAsync = createAsyncThunk(
  "user/getPersonalDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserService.getPersonalDetailsAPI();
      return response.data?.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Kişisel bilgiler yüklenemedi",
      );
    }
  },
);

export const updatePersonalDetailsAsync = createAsyncThunk(
  "user/updatePersonalDetails",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await UserService.updatePersonalDetailsAPI(data);
      return response.data?.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Kişisel bilgiler güncellenemedi",
      );
    }
  },
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    setPersonalDetails: (state, action: PayloadAction<PersonalDetails>) => {
      state.personalDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Personal Details
      .addCase(getPersonalDetailsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPersonalDetailsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.personalDetails = action.payload;
      })
      .addCase(getPersonalDetailsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Personal Details
      .addCase(updatePersonalDetailsAsync.pending, (state, action) => {
        const data = action.meta.arg;
        state.isUpdating = true;
        state.error = null;
        state.personalDetails = {
          ...state.personalDetails,
          ...data,
        };
      })
      .addCase(updatePersonalDetailsAsync.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.personalDetails = action.payload;
      })
      .addCase(updatePersonalDetailsAsync.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserError, setPersonalDetails } = userSlice.actions;

export default userSlice.reducer;
