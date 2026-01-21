import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios"; // your axios instance

export const fetchSuggestions = createAsyncThunk(
  "suggestions/fetchSuggestions",
  async (query: string) => {
    const res = await api.get(`/api/Auth/me`);
    return res.data;
  }
);

interface ProfileState {
  UserId: string;
  Email: string;
  UserName: string;
  Roles: string[];
  errors?: string;
  loading: boolean;
}

const initialState: ProfileState = {
  UserId: "",
  Email: "",
  UserName: "",
  Roles: [],
  errors: undefined,
  loading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearSuggestions(state) {
      state.errors = undefined;
    }
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
