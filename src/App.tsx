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
// import { Routes, Route } from "react-router-dom";
import Cart from './components/Cart';
 import Cancel from './components/Cancel';
 import Success from './components/Success'
import Header from './components/Headers';
import Order from './components/Order';
import OrderDates from './components/Reports/OrderDates';
import OrderAnalytics from './components/OrderAnalytics';
import {BrowserRouter ,Route,Routes } from "react-router-dom";

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
  }, [dispatch]);
  return (
<>
{/* <Users /> */}
    
      <BrowserRouter>
        <Header/>
     <Routes>
      <Route path="/users" element={<Users />} />
      <Route path="/" element={<Login />} />
      <Route path="/testWeather" element={<WeatherTest />} />
      <Route path='/products' element={<Product/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/orders' element={<Order/>}/>
      <Route path='/analytics' element={<OrderAnalytics/>}/>
      <Route path='/orderByDateRep' element={<OrderDates/>}/>
      <Route path='/success' element={<Success/>}/>
      <Route path='/cancel' element={<Cancel/>}/>
    </Routes>
     </BrowserRouter>

</>
  )
  
    
    {/* {user ? <><Profile /><Dashboard /><Weather /> <WeatherTest/></> : <Login />} */}
    
    
}

export default App;
