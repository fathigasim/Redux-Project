// import axios from "axios";
// import { store } from "../app/store"; 
// import { refreshTokenThunk, logout } from "../features/authSlice";
// import i18n from "../i18n"; 

// const apiUrl = import.meta.env.VITE_API_URL;

// const axiosInstance = axios.create({
//   baseURL: apiUrl,
//   headers: { 'accept-language': i18n.language },
//   withCredentials: true, // <--- CRITICAL: Ensures cookies are sent
// });

// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// export const setupAxiosInterceptors = () => {
//   // Request Interceptor
//   axiosInstance.interceptors.request.use(
//     (config) => {
//       const token = store.getState().auth.accessToken;
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
      
//       const lang = localStorage.getItem("lang") || "en";
//       config.headers["Accept-Language"] = i18n.language || lang;
      
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   // Response Interceptor
//   axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       const originalRequest = error.config;

//       // Skip refresh logic for auth endpoints
//       // Note: We check '/refresh' specifically to prevent infinite loops
//       const isAuthEndpoint = originalRequest.url?.includes('/login') || 
//                              originalRequest.url?.includes('/register') ||
//                              originalRequest.url?.includes('/refresh-token'); // Match your backend route exactly

//       // Handle 500 errors
//       if (error.response?.status === 500) {
//         console.error("❌ Server error (500) encountered.");
//         window.location.href="/error";
//         return Promise.reject(error);
//       }

//       // Handle 401 Unauthorized
//       if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
        
//         // --- MODIFICATION START ---
//         // We REMOVED the check for "if (!refreshToken)"
//         // because JS cannot see the HttpOnly cookie. 
//         // We simply assume the cookie might be there and try to refresh.
//         // --------------------------

//         if (isRefreshing) {
//           return new Promise((resolve, reject) => {
//             failedQueue.push({ resolve, reject });
//           })
//             .then((token) => {
//               originalRequest.headers.Authorization = `Bearer ${token}`;
//               return axiosInstance(originalRequest);
//             })
//             .catch((err) => Promise.reject(err));
//         }

//         originalRequest._retry = true;
//         isRefreshing = true;

//         try {
//           console.log("🔄 401 detected - Attempting silent refresh via Cookie...");

//           // --- MODIFICATION: PASSING EXPIRED ACCESS TOKEN ---
//           // Based on your backend code (AuthService), it needs the 
//           // expired AccessToken to extract the User Claims.
//           const expiredToken = store.getState().auth.accessToken;

//           // We pass the expired access token to the thunk. 
//           // The Refresh Token is NOT passed (it's in the cookie).
//           const result = await store.dispatch(refreshTokenThunk({ 
//               accessToken: expiredToken 
//           })).unwrap();
          
//           console.log("✅ Token refresh successful");
          
//           processQueue(null, result.accessToken);
          
//           // Retry original request
//           originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
//           return axiosInstance(originalRequest);
          
//         } catch (err) {
//           console.error("❌ Refresh failed or Session expired");
          
//           processQueue(err, null);
//           store.dispatch(logout());
          
//           return Promise.reject(err);
//         } finally {
//           isRefreshing = false;
//         }
//       }

//       return Promise.reject(error);
//     }
//   );
// };

// export default axiosInstance;

import axios from "axios";
import { store } from "../app/store"; // Adjust path to your store
import { refreshTokenThunk, logout } from "../features/authSlice";
import i18n from "../i18n"; 

const apiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: { 'accept-language': i18n.language },
  withCredentials: true, 
});
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 👇 DELETE "export const setupAxiosInterceptors = () => {"
// 👇 JUST RUN THE CODE DIRECTLY IN THE FILE:

// 1. Request Interceptor (Attaches Token)
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from Redux
    let token = store.getState().auth.accessToken;

    if (token) {
      // Clean quotes just in case
      token = token.replace(/^"|"$/g, '');
      
      // Attach Header
      config.headers.Authorization = `Bearer ${token}`;
      
      // Debug log - CHECK YOUR CONSOLE FOR THIS
      console.log("🚀 Attaching Token:", config.headers.Authorization);
    } else {
      console.warn("⚠️ No Access Token found in Redux - Sending request without Auth header");
    }
    
    // Language handling
    const lang = localStorage.getItem("lang") || "en";
    config.headers["Accept-Language"] = i18n.language || lang;
    
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor (Handles Refresh)
axiosInstance.interceptors.response.use(
     (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Skip refresh logic for auth endpoints
      // Note: We check '/refresh' specifically to prevent infinite loops
      const isAuthEndpoint = originalRequest.url?.includes('/login') || 
                             originalRequest.url?.includes('/register') ||
                             originalRequest.url?.includes('/refresh-token'); // Match your backend route exactly

      // Handle 500 errors
      if (error.response?.status === 500) {
        console.error("❌ Server error (500) encountered.");
        window.location.href="/error";
        return Promise.reject(error);
      }

      // Handle 401 Unauthorized
      if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
        
        // --- MODIFICATION START ---
        // We REMOVED the check for "if (!refreshToken)"
        // because JS cannot see the HttpOnly cookie. 
        // We simply assume the cookie might be there and try to refresh.
        // --------------------------

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
          console.log("🔄 401 detected - Attempting silent refresh via Cookie...");

          // --- MODIFICATION: PASSING EXPIRED ACCESS TOKEN ---
          // Based on your backend code (AuthService), it needs the 
          // expired AccessToken to extract the User Claims.
          const expiredToken = store.getState().auth.accessToken;

          // We pass the expired access token to the thunk. 
          // The Refresh Token is NOT passed (it's in the cookie).
          const result = await store.dispatch(refreshTokenThunk({ 
              accessToken: expiredToken 
          })).unwrap();
          
          console.log("✅ Token refresh successful");
          
          processQueue(null, result.accessToken);
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
          return axiosInstance(originalRequest);
          
        } catch (err) {
          console.error("❌ Refresh failed or Session expired");
          
          processQueue(err, null);
          store.dispatch(logout());
          
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
      // ... keep your existing refresh logic here ...
      // (Copy the rest of your response interceptor logic here)
      
      return Promise.reject(error);
    }
);

export default axiosInstance;