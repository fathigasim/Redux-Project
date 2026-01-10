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

export default function RequireAuth({ 
  children, 
  allowedRoles 
}: RequireAuthProps): ReactNode {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  // Get auth state from Redux
  const { accessToken, loading: authLoading } = useSelector(
    (state: RootState) => state.auth
  );
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        // ✅ SCENARIO 1: No token at all → Redirect to login
        if (!accessToken) {
          console.warn("⚠️ No access token found - Redirecting to login");
          if (isMounted) {
            setIsAuthorized(false);
            setIsVerifying(false);
          }
          return;
        }

        // ✅ SCENARIO 2: Token exists and is valid → Allow access
        if (!isTokenExpired(accessToken)) {
          console.log("✅ Valid token found - Granting access");
          if (isMounted) {
            setIsAuthorized(true);
            setIsVerifying(false);
          }
          return;
        }

        // ✅ SCENARIO 3: Token expired → Try to refresh
        console.log("🔄 Token expired - Attempting refresh...");
        
        try {
          await dispatch(refreshTokenThunk()).unwrap();
          
          console.log("✅ Token refresh successful - Granting access");
          if (isMounted) {
            setIsAuthorized(true);
          }
        } catch (refreshError: any) {
          console.error("❌ Token refresh failed:", refreshError);
          
          // Check if session was invalidated (single session enforcement)
          const errorMessage = refreshError?.message?.toLowerCase() || '';
          
          if (
            errorMessage.includes('invalidated') || 
            errorMessage.includes('logged in elsewhere')
          ) {
            console.warn("⚠️ Session invalidated - User logged in elsewhere");
          } else {
            console.warn("⚠️ Session expired");
          }
          
          if (isMounted) {
            setIsAuthorized(false);
          }
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    };

    // Only run verification after initial auth loading is complete
    if (!authLoading) {
      verifyAuth();
    }

    return () => {
      isMounted = false;
    };
  }, [accessToken, authLoading, dispatch]);

  // ✅ Show loading spinner during initial auth load OR verification
  if (authLoading || isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // ✅ Redirect to login if not authorized (with return URL)
  if (!isAuthorized) {
    const fullPath = `${location.pathname}${location.search}`;
      console.log(`🔐 Redirecting to login`);
  console.log(`   From: ${fullPath}`); // Should show: /products?sort=lowToHigh&page=2
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location.pathname + location.search, // ✅ Include query params
          message: "Please log in to access this page" 
        }} 
        replace 
      />
    );
  }

  // ✅ RBAC (Role-Based Access Control) Check
  if (allowedRoles && allowedRoles.length > 0 && accessToken) {
    const userRoles = getUserRoles(accessToken);
    const hasPermission = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasPermission) {
      console.warn(
        `⚠️ Access denied - Required roles: ${allowedRoles.join(', ')}, User roles: ${userRoles.join(', ')}`
      );
      return (
        <Navigate 
          to="/unauthorized" 
          state={{ 
            requiredRoles: allowedRoles,
            userRoles: userRoles,
            attemptedPath: location.pathname
          }}
          replace 
        />
      );
    }

    console.log(`✅ Role check passed - User has role(s): ${userRoles.join(', ')}`);
  }

  // ✅ All checks passed - Render protected content
  return <>{children}</>;
}