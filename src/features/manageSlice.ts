import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axios";

interface AuthState {
  loading: boolean;
  success: string | null;
  error: string | null;
}

const initialState: AuthState = {
  loading: false,
  success: null,
  error: null,
};

// =============== 🔹 FORGOT PASSWORD ===============
export const forgotPassword = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: { message: string } }
>(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/Auth/forgot-password", { email });
      return { message: res.data.message };
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Error sending password reset link.";
      return rejectWithValue({ message });
    }
  }
);

// =============== 🔹 RESET PASSWORD ===============
export const resetPassword = createAsyncThunk<
  { message: string },
  { token: string; newPassword: string },
  { rejectValue: { message: string } }
>(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/Auth/reset-password", {
        token,
        newPassword,
      });
      return { message: res.data.message };
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Error resetting password.";
      return rejectWithValue({ message });
    }
  }
);

// =============== 🔹 SLICE ===============
const manageSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearMessages(state) {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Unexpected error.";
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Unexpected error.";
      });
  },
});

export const { clearMessages } = manageSlice.actions;
export default authSlice.reducer;
