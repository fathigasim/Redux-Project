import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAppDispatch } from './app/hook';
import { loadStoredAuth } from './features/authSlice';

// Auth Components
import RequireAuth from './auth/RequireAuth';
import Logins from './components/logins';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Unauthorized from './components/Unauthorized';

// Public Components
import Products from './components/Products';

import WeatherTest from './components/WeatherTest';
import Basket from './components/Basket';
import NavigationBar from './components/NavigationBar';
import NotFound from './components/NotFound';
import Error from './components/Error';
import Home from './components/Home';

// Protected Components (Generic User)
import Order from './components/Order';
import Success from './components/Success';
import Cancel from './components/Cancel';
import PdfReport from './components/Reports/PdfReport';

// Admin Components
import Users from './components/Users';
import Product from './components/Product';
import ProductFilter from './components/ProductsFilter';
import OrderAnalytics from './components/OrderAnalytics';
import OrderDates from './components/Reports/OrderDates';
import OrderTotals from './components/Reports/OrderTotals';
import RechartAnalysis from './components/Reports/RechartAnalysis';
import ConfirmEmail from './components/ConfirmEmail';

function App() {
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // We only load auth here. 
        // Interceptors are already set up in main.tsx
        await dispatch(loadStoredAuth()); 
        console.log('✅ Auth state loaded from storage');
      } catch (error) {
        console.warn('⚠️ Failed to load auth state', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, [dispatch]);

  // Loading Screen
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing Application...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* ✅ NavigationBar must be inside BrowserRouter to use <Link> */}
      <NavigationBar />
      
      <div className="container mx-auto p-4">
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Home />} />
           
            
          <Route path="/login" element={<Logins />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/error" element={<Error />} />
          <Route path="/basket" element={<Basket />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          
          {/* Testing Routes (Public?) */}
          <Route path="/testWeather" element={<WeatherTest />} />
          


          {/* ================= PROTECTED ROUTES (Logged In Users) ================= */}
          <Route element={<RequireAuth> <div /> </RequireAuth>}> 
             {/* Note: You can wrap multiple routes like this or individually */}
          </Route>

          <Route path="/orders" element={
            <RequireAuth>
              <Order />
            </RequireAuth>
          } />
          
          <Route path="/success" element={
            <RequireAuth>
              <Success />
            </RequireAuth>
          } />

          <Route path="/cancel" element={
            <RequireAuth>
              <Cancel />
            </RequireAuth>
          } />

           <Route path="/printPdf" element={
             <RequireAuth>
               <PdfReport />
             </RequireAuth>
           } />
              {/* ================= USER  ROUTES ================= */}
             <Route path="/products" element={<RequireAuth allowedRoles={['Admin','User']}> 
              <Products />
              </RequireAuth>} />
              <Route path="/productfilter" element={<RequireAuth allowedRoles={['Admin','User']}> 
              <ProductFilter />
              </RequireAuth>} />

          {/* ================= ADMIN ROUTES ================= */}
          {/* Ensure these require specific roles */}
          <Route path="/users" element={
            <RequireAuth allowedRoles={['Admin']}>
              <Users />
            </RequireAuth>
          } />

          {/* <Route path="/product" element={
            <RequireAuth allowedRoles={['Admin']}>
              <Product />
            </RequireAuth>
          } /> */}

          <Route path="/analytics" element={
            <RequireAuth allowedRoles={['Admin']}>
              <OrderAnalytics />
            </RequireAuth>
          } />

          <Route path="/charts" element={
            <RequireAuth allowedRoles={['Admin']}>
              <RechartAnalysis />
            </RequireAuth>
          } />

          <Route path="/orderByDateRep" element={
            <RequireAuth allowedRoles={['Admin']}>
              <OrderDates />
            </RequireAuth>
          } />

          <Route path="/ordertotals" element={
            <RequireAuth allowedRoles={['Admin']}>
              <OrderTotals />
            </RequireAuth>
          } />

          {/* ================= 404 ================= */}
          <Route path="*" element={<NotFound />} />
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;