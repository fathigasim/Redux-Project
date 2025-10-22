import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios"; // your axios instance

export const fetchSuggestions = createAsyncThunk(
  "suggestions/fetchSuggestions",
  async (query: string) => {
    const res = await api.get(`/api/products/suggest?query=${query}`);
    return res.data;
  }
);

interface SuggestionState {
  items: { id: string; name: string }[];
  loading: boolean;
}

const initialState: SuggestionState = {
  items: [],
  loading: false,
};

const suggestionSlice = createSlice({
  name: "suggestions",
  initialState,
  reducers: {
    clearSuggestions(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchSuggestions.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearSuggestions } = suggestionSlice.actions;
export default suggestionSlice.reducer;
