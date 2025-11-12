
// import { useAppSelector, useAppDispatch } from './app/hooks';
// import Login from './components/Login';
// import Profile from './components/Profile';
// import Weather from './components/Weather';
 import WeatherTest from './components/WeatherTest';
// import Dashboard from './components/Dashboard';
//import { loadUserFromStorage } from './features/authSlice';
//import { useTokenRefresh } from './hooks/useTokenRefresh';
import { useEffect,useState } from 'react';
import { useAppDispatch } from './app/hooks';
import { loadStoredAuth } from './features/authSlice';
/*import Login from './components/Login';*/
import Logins from './components/logins';
import Users from './components/Users';
import Product from './components/Product';
import Products from './components/Products';
// import { Routes, Route } from "react-router-dom";
import Cart from './components/Cart';
 import Cancel from './components/Cancel';
 import Success from './components/Success'
// import Header from './components/Headers';
import Order from './components/Order';
import OrderDates from './components/Reports/OrderDates';
import OrderAnalytics from './components/OrderAnalytics';
import ForgotPassword from './components/ForgotPassword';
 import ResetPassword from './components/ResetPassword';
import {BrowserRouter ,Route,Routes } from "react-router-dom";
import { setupAxiosInterceptors } from './api/axios';



import NavigationBar from './components/NavigationBar';
import Register from './components/Register';
import RequireAuth from './auth/RequireAuth';
import OrderTotals from './components/Reports/OrderTotals';


function App() {
const dispatch = useAppDispatch();
 const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // ✅ STEP 1: Setup axios interceptors ONCE when app mounts
        setupAxiosInterceptors();
        
        // ✅ STEP 2: Load stored auth from localStorage into Redux
        await dispatch(loadStoredAuth()).unwrap();
        
        console.log('✅ App initialized: Interceptors setup & auth loaded');
      } catch (error) {
        console.log('⚠️ No stored auth found or error loading auth');
      } finally {
        // Always set initialized to true, even if no auth found
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, [dispatch]); // Run only once on mount

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
<>
{/* <Users /> */}
    
      <BrowserRouter>
        {/* <Header/> */}
        <NavigationBar />
        
     <Routes>
      <Route path="/users" element={<Users />} />
      {/*<Route path="/" element={<Login />} />*/}
      <Route path="/testWeather" element={<WeatherTest />} />
      <Route path='/product' element={<RequireAuth>< Product /></RequireAuth>}/>
      <Route path='/products' element={<Products />}/>
      <Route path='/forgot' element={<ForgotPassword/>}/>
      <Route path='/reset' element={<ResetPassword/>}/>
      <Route path='/cart' element={<RequireAuth><Cart/></RequireAuth>}/>
      <Route path='/orders' element={<RequireAuth><Order /></RequireAuth>}/>
      <Route path='/analytics' element={<OrderAnalytics/>}/>
      <Route path='/orderByDateRep' element={<OrderDates/>}/>
      <Route path='/ordertotals' element={<OrderTotals/>}/>
      <Route path='/success' element={<Success/>}/>
      <Route path='/cancel' element={<Cancel/>}/>
      <Route path='/logins' element={<Logins/>}/>
      <Route path='/register' element={<Register/>}/>
      
    </Routes>
    
     </BrowserRouter>

</>
  )
  
    
    {/* {user ? <><Profile /><Dashboard /><Weather /> <WeatherTest/></> : <Login />} */}
    
    
}

export default App;
