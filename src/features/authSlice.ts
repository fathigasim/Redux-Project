import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

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

// Load auth from localStorage
export const loadStoredAuth = createAsyncThunk("auth/loadStoredAuth", async () => {
  const stored = localStorage.getItem("auth");
  if (stored) return JSON.parse(stored);
  return { token: null, refreshToken: null,user:null };
});

// Login thunk
export const login = createAsyncThunk<
{token:string,refreshToken:string,activeuser:string}//response type (can replace with your actual model)
,{username:string,password:string}//input type
,{rejectValue:{error:string}}//thunkAPI type error payload typ
>(
  "auth/login",
  async (credentials: { username: string; password: string }, { rejectWithValue}
  ) => {
    try {
      const res = await api.post("/api/auth/login", credentials);
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

// Refresh token thunk
export const refreshTokenThunk = createAsyncThunk(
  "auth/refreshToken",
  async (refreshToken: string, { getState }) => {
    const state: any = getState();
    const accessToken = state.auth.token; // current access token
    const response = await api.post("/token/refresh", {
      accessToken,
      refreshToken,
    });
    return response.data;
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
        localStorage.setItem("auth", JSON.stringify(action.payload));
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
