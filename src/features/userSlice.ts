import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api/axios';
import { type RootState } from '../app/store';

interface UserProfile {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

// Fetch user profile
export const fetchUserProfile = createAsyncThunk<UserProfile, void, { state: RootState }>(
  'user/fetchUserProfile',
  async () => {
    const res = await api.get<UserProfile>('/profile');
    return res.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUserProfile.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
      .addCase(fetchUserProfile.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to load profile'; });
  },
});

export default userSlice.reducer;
