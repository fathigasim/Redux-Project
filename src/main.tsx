import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { store } from './app/store'

import './index.css'
import './App.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { ThemeProvider } from './context/themeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-rtl/dist/css/bootstrap-rtl.min.css';

import "./i18n";



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
  <ToastContainer position="top-right" autoClose={3000} />
      <ThemeProvider>
        
        
    <App />
    
    </ThemeProvider>
    </Provider>
  </StrictMode>,
)
