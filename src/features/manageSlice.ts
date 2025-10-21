import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

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
  { email: string }
  ,
  { rejectValue:{mailerror:string} }
>(
  "auth/forgotPassword",
  async ( {email} , { rejectWithValue }) => {
    try {
      const res = await api.post("/Auth/forgot",  {email} );
      return { message: res.data.message };
    } catch (err: any) {
      console.log(err.response);
      if(err.response?.data){
            // const errorData = err.response?.data?.errors.email;
        return rejectWithValue({mailerror:err.response?.data.errors.email[0]}    );
      }
     
      else{
      return rejectWithValue({mailerror:"Error sending password reset link."} );
      }
 
      
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
      const res = await api.post("/Auth/reset", {
        token,
        newPassword,
      });
      return { message: res.data.message };
    } catch (err: any) {
      console.log(err);
     
            if(err.response?.data?.errors?.newPassword[0]&&err.response?.data?.errors?.newPassword[1]){
        return rejectWithValue({ message: err.response?.data.errors.newPassword[0] +''+err.response?.data.errors.newPassword[1] });
            }
            else if(err.response?.data?.errors?.newPassword[0]){
      
              return rejectWithValue({ message:err.response?.data.errors.newPassword[0] });
            
      }
            else if(err.response?.data?.errors?.newPassword[1]){
      
              return rejectWithValue({ message:err.response?.data.errors.newPassword[1] });
            
      }
            else{
        return rejectWithValue({ message: "Error resetting password."});
            }
    }
  }
);

// =============== 🔹 SLICE ===============
const manageSlice = createSlice({
  name: "manage",
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
        state.error = action.payload?.mailerror || "Unexpected error.";
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
        state.success = null;
        state.error = action.payload?.message || "Unexpected error.";
      });
  },
});

export const { clearMessages } = manageSlice.actions;
export default manageSlice.reducer;
