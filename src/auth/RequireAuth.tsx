// components/RequireAuth.tsx

import { type ReactNode, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { refreshTokenThunk } from "../features/authSlice";
import { isTokenExpired, getUserRoles } from "../utils/jwtUtils";
import type { AppDispatch, RootState } from "../app/store";

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function RequireAuth({ children, allowedRoles }: RequireAuthProps): ReactNode {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  // Get auth state AND loading state from Redux
  const { accessToken, loading: reduxLoading } = useSelector((state: RootState) => state.auth);
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. If Redux is still loading stored auth, DO NOTHING yet.
    if (reduxLoading) return;

    let isMounted = true;

    const verifyAuth = async () => {
      // --- Scenario A: Valid Token ---
      if (accessToken && !isTokenExpired(accessToken)) {
        if (isMounted) {
          setIsAuthorized(true);
          setIsVerifying(false);
        }
        return;
      }

      // --- Scenario B: Refresh Needed ---
      console.log("🔄 Token missing/expired. Refreshing...");
      try {
        await dispatch(refreshTokenThunk({ accessToken: accessToken || "" })).unwrap();
        if (isMounted) setIsAuthorized(true);
      } catch (err) {
        if (isMounted) setIsAuthorized(false);
      } finally {
        if (isMounted) setIsVerifying(false);
      }
    };

    verifyAuth();

    return () => { isMounted = false; };
  }, [accessToken, reduxLoading, dispatch]);

  // Show spinner while Redux loads OR we are verifying token
  if (reduxLoading || isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    );
  }

  // Redirect if not authorized
  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // RBAC Check
  // Note: We use the helper to extract the role from the long URL
  if (allowedRoles && allowedRoles.length > 0 && accessToken) {
    const userRoles = getUserRoles(accessToken); 
    const hasPermission = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}