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
    const res = await api.post("/auth/register", userentry);
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
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
        state.success = null;
        state.formErrors = {};

       
      });
  },
});

export const { clearMessages } = registerSlice.actions;
export default registerSlice.reducer;
