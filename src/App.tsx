// import  { useEffect } from 'react';
// import { useAppSelector, useAppDispatch } from './app/hooks';
// import Login from './components/Login';
// import Profile from './components/Profile';
// import Weather from './components/Weather';
 import WeatherTest from './components/WeatherTest';
// import Dashboard from './components/Dashboard';
//import { loadUserFromStorage } from './features/authSlice';
//import { useTokenRefresh } from './hooks/useTokenRefresh';
import { useEffect } from 'react';
import { useAppDispatch } from './app/hooks';
import { loadStoredAuth } from './features/authSlice';
import Login from './components/Login';
import Users from './components/Users';
import Product from './components/Product';
import { Routes, Route } from "react-router-dom";

function App() {
  // const dispatch = useAppDispatch();
  // const { user } = useAppSelector((state) => state.auth);

  // useEffect(() => {
  //   dispatch(loadUserFromStorage());
  // }, [dispatch]);

  //useTokenRefresh();
const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadStoredAuth());
  }, []);
  return (
<>
{/* <Users /> */}
     <Routes>
      <Route path="/users" element={<Users />} />
      <Route path="/" element={<Login />} />
      <Route path="/testWeather" element={<WeatherTest />} />
      <Route path='/products' element={<Product/>}/>
    </Routes>
     

</>
  )
  
    
    {/* {user ? <><Profile /><Dashboard /><Weather /> <WeatherTest/></> : <Login />} */}
    
    
}

export default App;
