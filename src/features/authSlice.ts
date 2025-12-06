import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "../api/axios";
import { isTokenExpired } from "../utils/jwtUtils";


interface AuthState {
  user: any | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
   formErrors: { email?: string; password?: string; };
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
  formErrors:{}
};

// Load from storage
export const loadStoredAuth = createAsyncThunk(
  "auth/loadStoredAuth",
  async () => {
    const stored = localStorage.getItem("auth");
    if (!stored) return { token: null, refreshToken: null, activeUser: null };

    const parsed = JSON.parse(stored);

    if (!parsed.token) {
      localStorage.removeItem("auth");
      return { token: null, refreshToken: null, activeUser: null };
    }

    // Token expired? Attempt refresh on app start
    if (isTokenExpired(parsed.token)) {
      if (!parsed.refreshToken) {
        localStorage.removeItem("auth");
        return { token: null, refreshToken: null, activeUser: null };
      }

      return {
        ...parsed,
        needsRefresh: true,
      };
    }

    return parsed;
  }
);

// Login
export const login = createAsyncThunk<
  { token: string; refreshToken: string; activeUser: any },
  { email: string; password: string },
  { rejectValue: Record<string, string[] | string> }
>(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/api/auth/login", credentials);
      const payload = {
        token: res.data.token,
        refreshToken: res.data.refreshToken,
        activeUser: res.data.activeUser,
      };

      localStorage.setItem("auth", JSON.stringify(payload));
      return payload;
    } catch (err: any) {
     console.log("Auth Slice Error:", err);
      
      // Access response from error object
      const res = err.response;
      
      if (!res) {
        // Network error or no response
        return rejectWithValue({ general: "Network error" });
      }

      console.log("Error status:", res.status);
      console.log("Error data:", res.data);

      // --- Case 1: 400 Bad Request (user/pass error) ---
      if (res.status === 400 && res.data?.error) {
        console.log(`User or pass error: ${res.data.error}`);
        return rejectWithValue({ passError: res.data.error });
      }

      // --- Case 2: ModelState validation errors ---
      if (res.data?.errors) {
        // { errors: { email: ["..."], password: ["..."] } }
        console.log("Model validation errors:", res.data.errors);
        return rejectWithValue(res.data.errors);
      }

      // --- Case 3: Backend localized message ---
      if (res.data?.error) {
        return rejectWithValue({ general: res.data.error });
      }

      // --- Fallback ---
      return rejectWithValue({ general: "Unexpected error" });
    }
  }
);

// Refresh token
export const refreshTokenThunk = createAsyncThunk(
  "auth/refreshToken",
  async (refreshToken: string, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      let accessToken = state.auth.token;

      if (!accessToken) {
        const stored = localStorage.getItem("auth");
        if (stored) accessToken = JSON.parse(stored).token;
      }

      const response = await api.post("/api/auth/token/refresh", {
        accessToken,
        refreshToken,
      });

      const newAuth = {
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        activeUser: response.data.activeUser,
      };

      // SAVE NEW TOKENS IN LOCAL STORAGE
      localStorage.setItem("auth", JSON.stringify(newAuth));

      return newAuth;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Refresh failed");
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      localStorage.removeItem("auth");
    },
  },
  extraReducers: (builder) => {
    builder
      // Load stored auth
      .addCase(loadStoredAuth.fulfilled, (state, action) => {
        state.token = action.payload.token || null;
        state.refreshToken = action.payload.refreshToken || null;
        state.user = action.payload.activeUser || action.payload.user || null;

        // If needsRefresh, let App.tsx trigger refresh
        state.loading = false;
      })

      // Login
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.activeUser;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
       
      })

      // Refresh
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.activeUser;
        //const parsedUser=localStorage.getItem("auth");
        // if(parsedUser){
        //   const userObj=JSON.parse(parsedUser);
        //   state.user=userObj.activeUser;}
        //   else{
        //     state.user=null;
        //   }
        
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
