import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/authSlice'
import userReducer from '../features/userSlice'
import weatherReducer from '../features/weatherSlice'
import weatherTestReducer from '../features/testSlice'
import usersReducer from '../features/usersSlice';
import productReducer from '../features/productSlice'


export const store = configureStore({
  reducer: {

    auth:authReducer,
    user: userReducer,
       weather: weatherReducer,
       weatherTest:weatherTestReducer,
       users:usersReducer,
       products:productReducer

  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;