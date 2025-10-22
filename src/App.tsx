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
/*import Login from './components/Login';*/
import Logins from './components/logins';
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
import ForgotPassword from './components/ForgotPassword';
 import ResetPassword from './components/ResetPassword';
import {BrowserRouter ,Route,Routes } from "react-router-dom";
import { Container } from 'react-bootstrap';

import Register from './components/Register';
import RequireAuth from './auth/RequireAuth';


function App() {

const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadStoredAuth());
  }, [dispatch]);
  return (
<>
{/* <Users /> */}
    
      <BrowserRouter>
        <Header/>
        
        <Container  style={{marginTop:100,top:70}}>
     <Routes>
      <Route path="/users" element={<Users />} />
      {/*<Route path="/" element={<Login />} />*/}
      <Route path="/testWeather" element={<WeatherTest />} />
      <Route path='/product' element={<Product />}/>
      <Route path='/forgot' element={<ForgotPassword/>}/>
      <Route path='/reset' element={<ResetPassword/>}/>
      <Route path='/cart' element={<RequireAuth><Cart/></RequireAuth>}/>
      <Route path='/orders' element={<RequireAuth><Order /></RequireAuth>}/>
      <Route path='/analytics' element={<OrderAnalytics/>}/>
      <Route path='/orderByDateRep' element={<OrderDates/>}/>
      <Route path='/success' element={<Success/>}/>
      <Route path='/cancel' element={<Cancel/>}/>
      <Route path='/logins' element={<Logins/>}/>
       <Route path='/register' element={<Register/>}/>
      
    </Routes>
    </Container>
     </BrowserRouter>

</>
  )
  
    
    {/* {user ? <><Profile /><Dashboard /><Weather /> <WeatherTest/></> : <Login />} */}
    
    
}

export default App;
