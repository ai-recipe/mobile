import { FoodItem, FoodListParams, searchFoods, selectFood } from "@/api/foods";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export type DietFilter =
  | "all"
  | "vegan"
  | "vegetarian"
  | "glutenFree"
  | "halal";

interface FoodPickerState {
  items: FoodItem[];
  page: number;
  totalPages: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasError: boolean;
  search: string;
  activeFilter: DietFilter;
}

const initialState: FoodPickerState = {
  items: [],
  page: 1,
  totalPages: 1,
  isLoading: false,
  isLoadingMore: false,
  hasError: false,
  search: "",
  activeFilter: "all",
};

function buildParams(
  search: string,
  filter: DietFilter,
  page: number,
): FoodListParams {
  const params: FoodListParams = { page, limit: 20 };
  if (search.trim()) params.search = search.trim();
  if (filter === "vegan") params.isVegan = true;
  if (filter === "vegetarian") params.isVegetarian = true;
  if (filter === "glutenFree") params.isGlutenFree = true;
  if (filter === "halal") params.isHalal = true;
  return params;
}

export const fetchFoodsAsync = createAsyncThunk(
  "foodPicker/fetchFoods",
  async (_, { rejectWithValue, getState }) => {
    const { search, activeFilter } = (getState() as RootState).foodPicker;
    try {
      const res = await searchFoods(buildParams(search, activeFilter, 1));
      console.log("res", JSON.stringify(res, null, 2));
      return res;
    } catch {
      console.log("error");
      return rejectWithValue("Failed to fetch foods");
    }
  },
);

export const fetchMoreFoodsAsync = createAsyncThunk(
  "foodPicker/fetchMoreFoods",
  async (_, { rejectWithValue, getState }) => {
    const { search, activeFilter, page, totalPages, isLoadingMore } = (
      getState() as RootState
    ).foodPicker;

    if (page >= totalPages) return rejectWithValue("no more");
    try {
      const res = await searchFoods(
        buildParams(search, activeFilter, page + 1),
      );
      return res;
    } catch {
      return rejectWithValue("Failed to fetch more foods");
    }
  },
);

export const selectFoodAsync = createAsyncThunk(
  "foodPicker/selectFood",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await selectFood(id);
      return res;
    } catch {
      return rejectWithValue("Failed to select food");
    }
  },
);
const foodPickerSlice = createSlice({
  name: "foodPicker",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setFilter: (state, action: PayloadAction<DietFilter>) => {
      state.activeFilter = action.payload;
    },
    resetFoodPicker: (state) => {
      state.items = [];
      state.page = 1;
      state.totalPages = 1;
      state.search = "";
      state.activeFilter = "all";
      state.hasError = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoodsAsync.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchFoodsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
        state.page = 1;
        state.totalPages = action.payload.pagination?.pages ?? 1;
      })
      .addCase(fetchFoodsAsync.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload !== "no more") state.hasError = true;
      })
      .addCase(fetchMoreFoodsAsync.pending, (state) => {
        state.isLoadingMore = true;
      })
      .addCase(fetchMoreFoodsAsync.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        state.items = [...state.items, ...action.payload.data];
        state.page = action.payload.pagination?.page ?? state.page + 1;
        state.totalPages = action.payload.pagination?.pages ?? state.totalPages;
      })
      .addCase(fetchMoreFoodsAsync.rejected, (state) => {
        state.isLoadingMore = false;
      });
  },
});

export const { setSearch, setFilter, resetFoodPicker } =
  foodPickerSlice.actions;
export default foodPickerSlice.reducer;
