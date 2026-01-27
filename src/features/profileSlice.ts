import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios"; // your axios instance


export const fetchProfile = createAsyncThunk(
  "Auth/profile",
  async () => {
    const res = await api.get(`/Auth/me`);
    console.log("Profile response data:", res.data.data);
    return res.data.data;
  }
);

interface ProfileState {
  userId: string;
  email: string;
  userName: string;

  roles: string[];
  message:string;
  errors?: string | null;
  loading: boolean;
}

const initialState: ProfileState = {
  userId: "",
  email: "",
  userName: "",
  roles: [],
  message:"",
  errors: null,
  loading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearMessages(state) {
      state.errors = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.userId = action.payload.userId;
        state.email = action.payload.email;
        state.userName = action.payload.userName;
        state.roles = action.payload.roles;
        state.message=action.payload.message;
         state.errors = null;
        state.loading = false;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.loading = false;
        state.errors = "Failed to fetch profile";
      });
  },
});

export const { clearMessages } = profileSlice.actions;
export default profileSlice.reducer;