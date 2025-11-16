// import { type ReactNode, useState, useEffect } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { refreshTokenThunk } from "../features/authSlice";
// import { isTokenExpired, getUserRoles} from "../utils/jwtUtils";
// import type { AppDispatch } from "../app/store";
// interface RequireAuthProps {
//   children: ReactNode;
//   allowedRoles?: string[]; // Optional: specify which roles can access
// }



// export default function RequireAuth({ children, allowedRoles }: RequireAuthProps): ReactNode {
//   const dispatch = useDispatch<AppDispatch>();
//   const location = useLocation();

//   const { token, refreshToken } = useSelector((state: any) => state.auth);
//   const [checking, setChecking] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     let isMounted = true; // Prevent state update on unmount

//     const verifyAuth = async () => {
//       // Case 1: No tokens at all → go to login
//       if (!token && !refreshToken) {
//         console.log("❌ No tokens found — user must log in.");
//         if (isMounted) {
//           setIsAuthenticated(false);
//           setChecking(false);
//         }
//         return;
//       }

//       // Case 2: Token expired → try refresh
//       if (token && isTokenExpired(token) && refreshToken) {
//         console.log("🔄 Token expired — attempting refresh...");
//         try {
//           await dispatch(refreshTokenThunk(refreshToken)).unwrap();
//           console.log("✅ Token refreshed successfully");
//           if (isMounted) {
//             setIsAuthenticated(true);
//           }
//         } catch (err) {
//           console.error("❌ Token refresh failed:", err);
//           if (isMounted) {
//             setIsAuthenticated(false);
//           }
//         } finally {
//           if (isMounted) {
//             setChecking(false);
//           }
//         }
//         return;
//       }

//       // Case 3: Token valid → allow access
//       if (token && !isTokenExpired(token)) {
//         console.log("✅ Token valid — user authenticated.");
//         if (isMounted) {
//           setIsAuthenticated(true);
//           setChecking(false);
//         }
//       }
//     };

//     verifyAuth();

//     return () => {
//       isMounted = false;
//     };
//   }, [token, refreshToken, dispatch]);

//   // ⏳ Show loading spinner until done checking
//   if (checking) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Verifying authentication...</p>
//         </div>
//       </div>
//     );
//   }

//   // ❌ Redirect if unauthenticated after check
//   if (!isAuthenticated) {
//     console.log("❌ RequireAuth: Redirecting to login page...");
//     return (
//       <Navigate
//         to={`/logins?redirect=${encodeURIComponent(
//           location.pathname + location.search
//         )}`}
//         replace
//       />
//     );
//   }
// // 🔥 ROLE CHECK
// if ((allowedRoles ?? []).length > 0) {
//   const userRoles = getUserRoles(token);

//   const hasPermission = (allowedRoles ?? []).some(
//     allowed => userRoles.includes(allowed)
//   );

//   console.log("Checking roles →", { allowedRoles, userRoles, hasPermission });

//   if (!hasPermission) {
//     return <Navigate to="/unauthorized" replace />;
//   }
// }
//   //✅ Access granted
//   console.log("✅ RequireAuth: Access granted to protected route.");
//   return <>{children}</>;
// }

import { type ReactNode, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { refreshTokenThunk } from "../features/authSlice";
import { isTokenExpired, getUserRoles } from "../utils/jwtUtils";
import type { AppDispatch } from "../app/store";

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function RequireAuth({ children, allowedRoles }: RequireAuthProps): ReactNode {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const { token, refreshToken } = useSelector((state: any) => state.auth);
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let isMounted = true;

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

      // Case 2: Token expired → try refresh SILENTLY
      if (token && isTokenExpired(token) && refreshToken) {
        console.log("🔄 Token expired — refreshing silently in background...");
        setIsRefreshing(true);
        
        try {
          await dispatch(refreshTokenThunk(refreshToken)).unwrap();
          console.log("✅ Token refreshed successfully (silent)");
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
            setIsRefreshing(false);
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

  // ⏳ ONLY show loading on initial check (not during refresh)
  if (checking && !isRefreshing) {
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
  if (!isAuthenticated && !checking) {
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

  // 🔥 ROLE CHECK
  if (isAuthenticated && (allowedRoles ?? []).length > 0) {
    const userRoles = getUserRoles(token);

    const hasPermission = (allowedRoles ?? []).some(
      allowed => userRoles.includes(allowed)
    );

    console.log("Checking roles →", { allowedRoles, userRoles, hasPermission });

    if (!hasPermission) {
      console.log("❌ User lacks required role, redirecting to unauthorized...");
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // ✅ Access granted - render children even during silent refresh
  console.log("✅ RequireAuth: Access granted to protected route.");
  return <>{children}</>;
}