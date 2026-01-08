import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// 1. STATE INTERFACE
// Correct: RefreshToken is removed (it lives in the cookie now)
interface AuthState {
  user: string | null; // Changed 'any' to 'string' to match backend "ActiveUser" (UserName)
  accessToken: string | null;
  expiresAt: string | null;
  loading: boolean;
  error: string | null;
  formErrors: { email?: string; password?: string; };
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  expiresAt: null,
  loading: false,
  error: null,
  formErrors: {}
};
export const loadStoredAuth = createAsyncThunk(
  "auth/loadStoredAuth",
  async () => {
    try {
      const stored = localStorage.getItem("auth");
      if (!stored) return { accessToken: null, expiresAt: null, activeUser: null };

      const parsed = JSON.parse(stored);

      // SAFETY CHECK: Ensure accessToken is a clean string
      if (parsed.accessToken) {
        // Remove any accidental double quotes if backend sent JSON stringified string
        parsed.accessToken = parsed.accessToken.replace(/^"|"$/g, '');
      }

      return parsed;
    } catch (e) {
      // If JSON parse fails, clear storage
      localStorage.removeItem("auth");
      return { accessToken: null, expiresAt: null, activeUser: null };
    }
  }
);

export const login = createAsyncThunk<
{ accessToken: string | null; activeUser?: string | null; expiresAt?: string | null }, // return
 { email: string; password: string }, // arg (credentials)
  { rejectValue: any } // thunkApi config
>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/login", credentials);
      const data = res.data.data; 

      // SAFETY: Ensure we store clean strings
      const accessToken = data.accessToken ? data.accessToken.replace(/^"|"$/g, '') : null;

      const payload = {
        accessToken: accessToken,
        activeUser: data.activeUser,
        expiresAt: data.expiresAt,
      };

      localStorage.setItem("auth", JSON.stringify(payload));
      return payload;
    } catch (err: any) {
      // Error handling matches your backend validation responses
      const res = err.response;
      if (!res) return rejectWithValue({ general: "Network error" });
      if (res.status === 400 && res.data?.error) return rejectWithValue({ passError: res.data.error });
      if (res.data?.errors) return rejectWithValue(res.data.errors);
      if (res.data?.error) return rejectWithValue({ general: res.data.error });
      return rejectWithValue({ general: "Unexpected error" });
    }
  }
);

// 4. LOGOUT THUNK (CORRECTED)
// Your Backend Controller: [HttpPost("revoke-token")] with [Authorize]
// It gets the user from the Access Token header, NOT the body.
// features/authSlice.ts

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_) => {
    try {
      // Just call the API to clear the HttpOnly cookie
      await api.post(`/api/auth/revoke-token`);
    } catch (err) {
      console.error("Logout failed on server, but clearing frontend anyway");
    }
    // We return nothing. The extraReducers will listen for the end of this function.
  }
);

// 5. REFRESH TOKEN THUNK
// Matches Backend: [HttpPost("refresh-token")]
export const refreshTokenThunk = createAsyncThunk<
  { accessToken: string; expiresAt: string; activeUser?: string }, 
  { accessToken: string }, 
  { rejectValue: any }
>(
  "auth/refreshToken",
  async (payload, { rejectWithValue }) => {
    try {
      // Body: { accessToken: "expired_token..." } -> Matches RefreshTokenDto
      // Cookie: sent automatically via withCredentials: true
      const response = await api.post(
        `/api/auth/refresh-token`, 
        { accessToken: payload.accessToken }, 
        { withCredentials: true }
      );
      
      const data = response.data.data; 

      const newAuth = {
        accessToken: data.accessToken,
        expiresAt: data.expiresAt,
        activeUser: data.activeUser, 
      };

      // Merge with existing state in LocalStorage
      const stored = localStorage.getItem("auth");
      const previousState = stored ? JSON.parse(stored) : {};
      
      const mergedState = {
          ...previousState,
          ...newAuth,
          // Keep old username if backend didn't return it in refresh
          activeUser: newAuth.activeUser || previousState.activeUser 
      };

      localStorage.setItem("auth", JSON.stringify(mergedState));

      return mergedState;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      state.expiresAt = null;
      state.user = null;
      localStorage.removeItem("auth");
    },
  },
  extraReducers: (builder) => {
    builder
      // Load Stored Auth
      .addCase(loadStoredAuth.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.activeUser;
        state.expiresAt = action.payload.expiresAt;
        state.loading = false;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.activeUser;
        state.expiresAt = action.payload.expiresAt;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      })

      // Refresh Token
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.expiresAt = action.payload.expiresAt;
        if(action.payload.activeUser) {
            state.user = action.payload.activeUser;
        }
      })
      .addCase(refreshTokenThunk.rejected, (state) => {
          // If refresh fails (cookie expired), force logout
          state.accessToken = null;
          state.user = null;
          localStorage.removeItem("auth");
      })
      // 👇 HANDLE LOGOUT HERE 👇
      .addCase(logoutUser.fulfilled, (state) => {
        state.accessToken = null;
        state.expiresAt = null;
        state.user = null;
        localStorage.removeItem("auth");
      })
      // Even if server fails (e.g. 500 error), force logout on frontend
      .addCase(logoutUser.rejected, (state) => {
        state.accessToken = null;
        state.expiresAt = null;
        state.user = null;
        localStorage.removeItem("auth");
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;