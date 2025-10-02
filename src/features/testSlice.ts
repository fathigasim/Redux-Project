import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

interface Weather {
  date: string;
  temperatureC: number | null;
  summary: string | null;
}

interface WeatherState {
  data: Weather[];
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async () => {
    const res = await api.get("/WeatherForecast/GetWeatherForecast");
    return res.data;
  }
);

const weatherTestSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch weather";
      });
  },
});

export default weatherTestSlice.reducer;
