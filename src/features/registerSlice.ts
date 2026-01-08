import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

interface Register {
  username: string;
  email: string;
  password: string;
  confirmPassword:string;
}

interface RegisterState {
  register: Register;
  loading: boolean;
  error: string | null;
  success: string | null;
  formErrors: { username?: string; password?: string; email?: string };
}

const initialState: RegisterState = {
  register: { username: "", password: "",confirmPassword:"", email: "" },
  loading: false,
  success: null,
  error: null,
  formErrors: {},
};

export const registerUser = createAsyncThunk<
  { register: Register; message: string }, // response type
  { username: string; email: string; password: string;confirmPassword:string }, // input type
  { rejectValue: Record<string, string[] | string> } // error payload type
>("register/register", async (userentry, { rejectWithValue }) => {
  try {
    const res = await api.post("/api/auth/register", userentry);
    return { message: res.data.message, register: res.data.register };
  } catch (err: any) {
    console.log("Register error:", err.response);

    // Validation errors
    if (err.response?.status === 400 && err.response.data?.errors) {
      return rejectWithValue(err.response.data.errors);
    }

    // Backend message
    if (err.response?.data?.message) {
      return rejectWithValue({ general: err.response.data.message });
    }

    // Fallback
    return rejectWithValue({ general: "Unexpected error" });
  }
});

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.success = null;
      state.formErrors = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.formErrors = {};
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.error = null;
        state.register = action.payload.register;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.formErrors = {};

        const payload = action.payload as
          | { username?: string[]; password?: string[]; email?: string[] }
          | { general?: string }
          | undefined;

        if (payload && ("username" in payload || "password" in payload || "email" in payload)) {
          state.error = null;
          state.formErrors = {
            username: Array.isArray(payload.username) ? payload.username[0] : undefined,
            email: Array.isArray(payload.email) ? payload.email[0] : undefined,
            password: Array.isArray(payload.password) ? payload.password[0] : undefined,
          };
        } else if (payload && "general" in payload) {
          state.error = payload.general as string;
        } else {
          state.error = action.error?.message || "Unexpected error occurred";
        }
      });
  },
});

export const { clearMessages } = registerSlice.actions;
export default registerSlice.reducer;
