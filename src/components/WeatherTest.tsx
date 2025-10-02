import { useEffect } from 'react';
import {  useAppSelector } from '../app/hooks';
import { fetchWeather } from '../features/testSlice';
import { useTheme } from '../context/themeContext';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../app/store';

const WeatherTest = () => {

  //const [city, setCity] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { data:weatherTest, loading, error } =
    useAppSelector((state) => state.weatherTest);
  const { theme } = useTheme();

useEffect(() => {
    dispatch(fetchWeather());
}, [dispatch]);

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
      <h2>Weather Condition</h2>
   

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {weatherTest && (
        <div style={{ marginTop: '15px' }}>
         {weatherTest.map((w)=>( <div key={w.date}>
          <h3>{w.date}</h3>
          <p>{w.temperatureC}°C - {w.summary}</p>
          </div>))}
        </div>
      )}
    </div>
  );
};

export default WeatherTest;
