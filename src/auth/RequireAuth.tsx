import { type ReactNode, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { refreshTokenThunk } from "../features/authSlice";
import { isTokenExpired } from "../utils/jwtUtils";
import type { AppDispatch } from "../app/store";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const { token, refreshToken } = useSelector((state: any) => state.auth);
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true; // Prevent state update on unmount

    const verifyAuth = async () => {
      // Case 1: No tokens at all → go to login
      if (!token && !refreshToken) {
        console.log("❌ No tokens found — user must log in.");
        if (isMounted) {
          setIsAuthenticated(false);
          setChecking(false);
        }
        return;
      }

      // Case 2: Token expired → try refresh
      if (token && isTokenExpired(token) && refreshToken) {
        console.log("🔄 Token expired — attempting refresh...");
        try {
          await dispatch(refreshTokenThunk(refreshToken)).unwrap();
          console.log("✅ Token refreshed successfully");
          if (isMounted) {
            setIsAuthenticated(true);
          }
        } catch (err) {
          console.error("❌ Token refresh failed:", err);
          if (isMounted) {
            setIsAuthenticated(false);
          }
        } finally {
          if (isMounted) {
            setChecking(false);
          }
        }
        return;
      }

      // Case 3: Token valid → allow access
      if (token && !isTokenExpired(token)) {
        console.log("✅ Token valid — user authenticated.");
        if (isMounted) {
          setIsAuthenticated(true);
          setChecking(false);
        }
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [token, refreshToken, dispatch]);

  // ⏳ Show loading spinner until done checking
  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // ❌ Redirect if unauthenticated after check
  if (!isAuthenticated) {
    console.log("❌ RequireAuth: Redirecting to login page...");
    return (
      <Navigate
        to={`/logins?redirect=${encodeURIComponent(
          location.pathname + location.search
        )}`}
        replace
      />
    );
  }

  // ✅ Access granted
  console.log("✅ RequireAuth: Access granted to protected route.");
  return <>{children}</>;
}

///////////////////////////
//claude compare snippets
// import { type ReactNode, useState, useEffect } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { refreshTokenThunk } from '../store/slices/authSlice';
// import { isTokenExpired } from '../utils/jwtUtils';

// export default function RequireAuth({ children }: { children: ReactNode }) {
//   const dispatch = useDispatch();
//   const location = useLocation();
  
//   const { token, refreshToken } = useSelector((state: any) => state.auth);
//   const [isChecking, setIsChecking] = useState(true);

//   useEffect(() => {
//     const checkAndRefreshToken = async () => {
//       // If we have a token and it's expired, try to refresh
//       if (token && isTokenExpired(token) && refreshToken) {
//         console.log("🔄 RequireAuth: Token expired, attempting refresh...");
        
//         try {
//           await dispatch(refreshTokenThunk(refreshToken)).unwrap();
//           console.log("✅ RequireAuth: Token refreshed successfully");
//         } catch (error) {
//           console.error("❌ RequireAuth: Token refresh failed", error);
//         }
//       }
      
//       setIsChecking(false);
//     };

//     checkAndRefreshToken();
//   }, [token, refreshToken, dispatch]);

//   // Show loading state while checking authentication
//   if (isChecking) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Verifying authentication...</p>
//         </div>
//       </div>
//     );
//   }

//   // Check if user is authenticated with a valid token
//   const isAuthenticated = token !== null && !isTokenExpired(token);
  
//   if (!isAuthenticated) {
//     console.log("❌ RequireAuth: Not authenticated, redirecting to login");
//     return (
//       <Navigate 
//         to={`/logins?redirect=${encodeURIComponent(location.pathname + location.search)}`} 
//         replace 
//       />
//     );
//   }

//   console.log("✅ RequireAuth: User authenticated");
//   return <>{children}</>;
// }