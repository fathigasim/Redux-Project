import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
};

// Load auth from localStorage
export const loadStoredAuth = createAsyncThunk("auth/loadStoredAuth", async () => {
  const stored = localStorage.getItem("auth");
  if (stored) return JSON.parse(stored);
  return { token: null, refreshToken: null };
});

// Login thunk
export const login = createAsyncThunk<
any//response type (can replace with your actual model)
,{username:string,password:string}//input type
,{rejectValue:{error:string}}//thunkAPI type error payload typ
>(
  "auth/login",
  async (credentials: { username: string; password: string }, { rejectWithValue}
  ) => {
    try {
      const res = await api.post("/api/auth/login", credentials);
      return res.data; // { token, refreshToken }
    } catch (err: any) {
      console.log(err.response);
      // if(err.response?.data.otherError){
      //  return rejectWithValue({error:err.response?.data.error});
      // }
      if(err.response?.data.error){
       return rejectWithValue({error:err.response?.data.error});
      } else {
       return rejectWithValue({error:"Login failed"});
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
    const response = await api.post("/api/token/refresh", {
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
      localStorage.removeItem("auth");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadStoredAuth.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem("auth", JSON.stringify(action.payload));
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
