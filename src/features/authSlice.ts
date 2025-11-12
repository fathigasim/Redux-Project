import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axios";
import { isTokenExpired } from "../utils/jwtUtils";

interface AuthState {
  user:string|null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  
}

const initialState: AuthState = {
  user:null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
};

export const loadStoredAuth = createAsyncThunk(
  "auth/loadStoredAuth", 
  async (_, { dispatch }) => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log("this parsed auth local storage"+parsed)
      // If no token at all, clear everything
      if (!parsed.token) {
        console.log("⚠️ No token found, clearing auth");
        localStorage.removeItem("auth");
        return { token: null, refreshToken: null, user: null };
      }

      // If token is expired but we have a refresh token, try to refresh
      if (isTokenExpired(parsed.token)) {
        console.log("⚠️ Stored access token is expired");
        
        if (parsed.refreshToken) {
          console.log("🔄 Attempting to refresh token on app load...");
          
          // Temporarily set the expired token in state so refreshTokenThunk can access it
          // We need to return the parsed data first so it's in the store
          // Then the refreshTokenThunk will use it
          return {
            token: parsed.token, // ← Keep expired token temporarily for refresh
            refreshToken: parsed.refreshToken,
            activeuser: parsed.activeuser,
            needsRefresh: true // ← Flag to trigger refresh after load
          };
        } else {
          console.log("❌ No refresh token available, clearing auth");
          localStorage.removeItem("auth");
          return { token: null, refreshToken: null, user: null };
        }
      }

      console.log("✅ Loaded valid token from storage");
      return parsed;
    }
    return { token: null, refreshToken: null, user: null };
  }
);
// Login thunk
export const login = createAsyncThunk<
{token:string,refreshToken:string,activeuser:string}//response type (can replace with your actual model)
,{email:string,password:string}//input type
,{rejectValue:{error:string}}//thunkAPI type error payload typ
>(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue}
  ) => {
    try {
      const res = await axiosInstance.post("/api/auth/login", credentials);
        //  console.log("Login response:", res.data);
      // return res.data; // { token, refreshToken }
       return {token:res.data.token,refreshToken:res.data.refreshToken,activeuser:res.data.activeuser};
    } catch (err: any) {
      console.log(err.response);
 
      if(err.response?.data.error){
       return rejectWithValue({error:err.response?.data.error});
      } else {
       return rejectWithValue({error:"Network error"});
      }
  }
  }
);


  export const refreshTokenThunk = createAsyncThunk(
  "auth/refreshToken",
  async (refreshToken: string, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      let accessToken = state.auth.token;
      
      // If no access token in state, try to get it from localStorage
      if (!accessToken) {
        console.log("⚠️ No access token in state, checking localStorage...");
        const stored = localStorage.getItem("auth");
        if (stored) {
          const parsed = JSON.parse(stored);
          accessToken = parsed.token;
          console.log("✅ Found access token in localStorage");
        }
      }

      console.log("🔄 Refreshing token...", { 
        accessToken: accessToken?.substring(0, 20),
        refreshToken: refreshToken?.substring(0, 20)
      });
      
      const response = await axiosInstance.post("/api/auth/token/refresh", {
        accessToken, // This will now have the expired token
        refreshToken,
      }, { timeout: 20000 });
      
      console.log("✅ Token refreshed successfully");
      return response.data;
    } catch (err: any) {
       console.error("❌ Token refresh failed:", err.message);
      console.error("❌ Token refresh failed:", err.response?.data);
      return rejectWithValue(err.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user=null;
      localStorage.removeItem("auth");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadStoredAuth.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user=action.payload.activeuser
      
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user=action.payload.activeuser;
        state.loading=false
        state.error=null
        localStorage.setItem("auth", JSON.stringify(action.payload));
      }).addCase(login.pending, (state) => {
         state.error =null;
      
        state.loading = true;
        // localStorage.setItem("auth", JSON.stringify(action.payload));
      }).addCase(login.rejected, (state, action) => {
        state.error = action.payload?.error || "Login failed";
      
        state.loading = false;
        localStorage.setItem("auth", JSON.stringify(action.payload));
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        // Keep the user data, don't lose it on refresh!
  const currentAuth = {
    token: action.payload.token,
    refreshToken: action.payload.refreshToken,
    activeuser: state.user // ← Preserve current user
  };
        localStorage.setItem("auth", JSON.stringify(currentAuth));
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
