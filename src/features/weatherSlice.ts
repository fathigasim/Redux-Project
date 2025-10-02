import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import {type RootState } from '../app/store';

interface WeatherState {
  city: string;
  temperature: number | null;
  description: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  city: '',
  temperature: null,
  description: null,
  loading: false,
  error: null,
};
//const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
 const apiKey ='f324648e8c4d42b581c5ecd006cb87d9'
// ✅ Replace YOUR_API_KEY with your OpenWeatherMap key
export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (city: string) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!res.ok) throw new Error('City not found');
    const data = await res.json();
    return {
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
    };
  }
);

const weatherSlice = createSlice({
  name: 'weather',
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
        state.city = action.payload.city;
        state.temperature = action.payload.temperature;
        state.description = action.payload.description;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather';
      });
  },
});

export default weatherSlice.reducer;
