// api/axiosInstance.ts (or .js)
import axios from "axios";
import { store } from "../app/store";
import { setCredentials, logout } from "../features/authSlice";
import { refreshTokenThunk } from "../features/authSlice";
import i18n from "../i18n";

const apiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: { 
    'Accept-Language': i18n.language,
    'Content-Type': 'application/json'
  },
  withCredentials: true, // ✅ CRITICAL: Sends HttpOnly cookies
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// ===== REQUEST INTERCEPTOR =====
axiosInstance.interceptors.request.use(
  (config) => {
    // Attach access token from Redux
    const token = store.getState().auth.accessToken;
    
    if (token) {
      // Remove any accidental quotes
      const cleanToken = token.replace(/^"|"$/g, '');
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    
    // Update language header
    const lang = localStorage.getItem("lang") || "en";
    config.headers["Accept-Language"] = i18n.language || lang;
    
    return config;
  },
  (error) => Promise.reject(error)
);

// ===== RESPONSE INTERCEPTOR =====
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Auth endpoints that should NOT trigger refresh logic
    const authEndpoints = [
      '/auth/login',
      '/auth/register',
      '/auth/refresh-token',
      '/auth/confirm-email',
      '/auth/resend-confirmation',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/validate-reset-token'
    ];
    
    const isAuthEndpoint = authEndpoints.some(endpoint => 
      originalRequest.url?.includes(endpoint)
    );

    // ===== HANDLE SERVER ERRORS (500) =====
    if (error.response?.status === 500) {
      console.error("❌ Server error (500) encountered");
      
      // Optional: Show user-friendly error page
      window.location.href = "/error";
      
      return Promise.reject(error);
    }

    // ===== HANDLE UNAUTHORIZED (401) =====
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !isAuthEndpoint
    ) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 401 detected - Attempting silent token refresh...");

        // ✅ Call refresh endpoint (NO body - cookie-based)
        const result = await store.dispatch(refreshTokenThunk()).unwrap();
        
        console.log("✅ Token refresh successful");

        // ✅ Update Redux with new credentials
        store.dispatch(setCredentials({
          accessToken: result.accessToken,
          activeUser: result.activeUser,
          expiresAt: result.expiresAt
        }));
        
        // Process all queued requests
        processQueue(null, result.accessToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
        return axiosInstance(originalRequest);
        
      } catch (refreshError: any) {
        console.error("❌ Token refresh failed");
        
        // Fail all queued requests
        processQueue(refreshError, null);
        
        // ✅ Check if session was invalidated (single session enforcement)
        const errorMessage = refreshError?.message?.toLowerCase() || '';
        
        if (
          errorMessage.includes('invalidated') || 
          errorMessage.includes('logged in elsewhere') ||
          errorMessage.includes('another device')
        ) {
          // ✅ User-friendly message for session invalidation
          console.warn("⚠️ You've been logged in from another device");
          
          // Optional: Show toast/alert before redirect
          if (window.confirm) {
            alert("You've been logged in from another device. Please log in again.");
          }
        } else {
          console.warn("⚠️ Session expired - Please log in again");
        }
        
        // Clear auth state
        store.dispatch(logout());
        
        // Redirect to login
        window.location.href = "/login";
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ===== HANDLE OTHER ERRORS =====
    return Promise.reject(error);
  }
);

export default axiosInstance;