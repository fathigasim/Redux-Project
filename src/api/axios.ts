import axios from "axios";
import { store } from "../app/store"; // Your Redux store
import { refreshTokenThunk, logout } from "../features/authSlice";
import i18n from "../i18n"; // Your i18n instance
 const apiUrl = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
 
  // baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  // baseURL:"https://localhost:50586",
  baseURL:apiUrl,
  headers:{'accept-language':i18n.language},
  withCredentials: true,
  // timeout: 10000,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setupAxiosInterceptors = () => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      const lang = localStorage.getItem("lang") || "en";
      config.headers["Accept-Language"] = i18n.language || lang;
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  // axiosInstance.interceptors.response.use(
  //   (response) => response,
  //   async (error) => {
  //     const originalRequest = error.config;

  //     // Handle 401 errors (Unauthorized)
  //     if (error.response?.status === 401 && !originalRequest._retry) {
        
  //       // If already refreshing, queue this request
  //       if (isRefreshing) {
  //         return new Promise((resolve, reject) => {
  //           failedQueue.push({ resolve, reject });
  //         })
  //           .then((token) => {
  //             originalRequest.headers.Authorization = `Bearer ${token}`;
  //             return axiosInstance(originalRequest);
  //           })
  //           .catch((err) => Promise.reject(err));
  //       }

  //       originalRequest._retry = true;
  //       isRefreshing = true;

  //       try {
  //         console.log("🔄 401 detected - Attempting token refresh...");
          
  //         // Get refresh token from Redux store
  //         const refreshToken = store.getState().auth.refreshToken;
          
  //         if (!refreshToken) {
  //           console.log("❌ No refresh token available");
  //           throw new Error("No refresh token available");
  //         }

  //         // Dispatch the refresh token thunk
  //         const result = await store.dispatch(refreshTokenThunk(refreshToken)).unwrap();
          
  //         console.log("✅ Token refresh successful");
          
  //         // Process queued requests with new token
  //         processQueue(null, result.token);
          
  //         // Retry the original request with new token
  //         originalRequest.headers.Authorization = `Bearer ${result.token}`;
  //         return axiosInstance(originalRequest);
          
  //       } catch (err) {
  //         console.error("❌ Token refresh failed:", err);
          
  //         // Clear queue and logout user
  //         processQueue(err, null);
  //         store.dispatch(logout());
          
  //         // Optionally redirect to login page
  //         // window.location.href = '/login';
          
  //         return Promise.reject(err);
  //       } finally {
  //         isRefreshing = false;
  //       }
  //     }

  //     return Promise.reject(error);
  //   }
  // );
  axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic for login/register endpoints
    const isAuthEndpoint = originalRequest.url?.includes('/login') || 
                           originalRequest.url?.includes('/register') ||
                           originalRequest.url?.includes('/refresh');
  //try database failure senario
    if (error.response?.status ===500) {
      console.error("❌ Server error (500) encountered.");
      window.location.href = '/error';
      return Promise.reject(error);
      
    }  
    // Handle 401 errors (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      
      // Check if refresh token exists BEFORE attempting refresh
      const refreshToken = store.getState().auth.refreshToken;
      
      if (!refreshToken) {
        // No refresh token available - just reject without logging out
        // This is expected for first login attempts or expired sessions
        console.log("⚠️ No refresh token available - skipping refresh");
        return Promise.reject(error);
      }
      
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
        console.log("🔄 401 detected - Attempting token refresh...");
        
        // Dispatch the refresh token thunk
        const result = await store.dispatch(refreshTokenThunk(refreshToken)).unwrap();
        
        console.log("✅ Token refresh successful");
        
        // Process queued requests with new token
        processQueue(null, result.token);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${result.token}`;
        return axiosInstance(originalRequest);
        
      } catch (err) {
        console.error("❌ Token refresh failed:", err);
        
        // Clear queue and logout user
        processQueue(err, null);
        store.dispatch(logout());
        
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
};

export default axiosInstance;