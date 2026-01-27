import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/authSlice'
import userReducer from '../features/userSlice'
import weatherReducer from '../features/weatherSlice'
import weatherTestReducer from '../features/testSlice'
import usersReducer from '../features/usersSlice';
import productReducer from '../features/productSlice'
import orderReducer from '../features/orderSlice'
import manageReducer from '../features/manageSlice'
import languageReducer from '../features/languageSlice'
import registerReducer from '../features/registerSlice'
import suggestionReducer from '../features/suggestionSlice'
import orderstatReducer from '../features/orderstatSlice'
import basketReducer from '../features/basketSlice'
import categoryReducer from '../features/CategorySlice'
import profileReducer from '../features/profileSlice'



export const store = configureStore({
  reducer: {

    auth:authReducer,
    user: userReducer,
       weather: weatherReducer,
       weatherTest:weatherTestReducer,
       users:usersReducer,
       products:productReducer,
      // cart:cartReducer,
      orders:orderReducer,
      language:languageReducer,
      manage:manageReducer,
      register:registerReducer,
      seggessions:suggestionReducer,
      orderstats:orderstatReducer,
      basket:basketReducer,
      category:categoryReducer,
      profile:profileReducer,
  },
   // preloadedState
});

// Save cart to localStorage whenever it changes
// store.subscribe(() => {
//   try {
//     const state = store.getState()
//     const serializedCart = JSON.stringify(state.cart.items)
//     localStorage.setItem('cart', serializedCart)
//   } catch (e) {
//     console.error('Failed to save cart to localStorage', e)
//   }
// })
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;