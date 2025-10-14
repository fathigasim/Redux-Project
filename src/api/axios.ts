// // src/api/axios.ts
// import axios from "axios";
// import { store } from "../app/store";
// import { refreshToken, logout } from "../features/authSlice";

// const api = axios.create({
//   baseURL: "https://localhost:7171/", // your .NET API
//   headers: { "Content-Type": "application/json" },
// });
//   const storedAuth = localStorage.getItem('auth');
// const token = storedAuth ? JSON.parse(storedAuth) : null;
// // Attach access token before requests
// api.interceptors.request.use((config) => {
// //  const state: any = store.getState();
//  // const token = state.auth.token;
//   if (token) {
//     console.log(token);
//     config.headers.Authorization = `Bearer ${token.token}`;
//   }
//   return config;
// });

// // Refresh on 401
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     console.log(error)
//     const originalRequest = error.config;
//     const state: any = store.getState();

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       if (state.auth.refreshToken) {
//         const action = await store.dispatch(refreshToken(state.auth.refreshToken));
//         if (refreshToken.fulfilled.match(action)) {
//           originalRequest.headers.Authorization = `Bearer ${store.getState().auth.token}`;
//           return api(originalRequest);
//         }
//       }
//      store.dispatch(logout()); // force logout if refresh fails
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from "axios";
import { store } from "../app/store";
import { refreshTokenThunk, logout } from "../features/authSlice";
import i18n from "../i18n";

const api = axios.create({
  baseURL: "https://localhost:7171",
  headers: { "Content-Type": "application/json" },
});

// Attach token dynamically
api.interceptors.request.use((config) => {
  const state = store.getState() as { auth: { token?: string } };
  const token = state.auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
    const lang = localStorage.getItem("lang") || "en"; // store selected language
  config.headers["Accept-Language"] = i18n.language || lang; // send language in headers
  return config;
});

// Refresh token automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const state: any = store.getState();

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (state.auth.refreshToken) {
        const action = await store.dispatch(refreshTokenThunk(state.auth.refreshToken));
        if (refreshTokenThunk.fulfilled.match(action)) {
          originalRequest.headers.Authorization = `Bearer ${store.getState().auth.token}`;
          return api(originalRequest);
        }
      }

      // Refresh failed or no refresh token → force logout
      store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);

export default api;
