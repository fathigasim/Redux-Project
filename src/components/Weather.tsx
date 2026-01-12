import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hook';
import { fetchWeather } from '../features/weatherSlice';
import { useTheme } from '../context/themeContext';

const Weather = () => {
  const [city, setCity] = useState('');
  const dispatch = useAppDispatch();
  const { city: cityName, temperature, description, loading, error } =
    useAppSelector((state) => state.weather);
  const { theme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city) dispatch(fetchWeather(city));
  };

  return (
    <div
      style={{
        margin: '20px auto',
        maxWidth: '400px',
        padding: '20px',
        borderRadius: '8px',
        background: theme === 'light' ? '#f5f5f5' : '#222',
        color: theme === 'light' ? '#000' : '#fff',
      }}
    >
      <h2>Weather Checker</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ width: '70%', marginRight: '10px' }}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {cityName && (
        <div style={{ marginTop: '15px' }}>
          <h3>{cityName}</h3>
          <p>{temperature}°C - {description}</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
