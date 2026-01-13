import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { store } from './app/store'

import './index.css'
import './App.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { ThemeProvider } from './context/themeContext';
import { ToastContainer } from 'react-toastify';
import LoadingFallback from './components/LoadingFallback';
import 'react-toastify/dist/ReactToastify.css';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-rtl/dist/css/bootstrap-rtl.min.css';

import "./i18n";
import i18next from './i18n'



createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
  
  <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={i18next.language === 'ar'}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ThemeProvider>
        
        <Suspense fallback={<LoadingFallback />}>
    <App />
    </Suspense>
    </ThemeProvider>
    </Provider>
  //</StrictMode> 
  ,
)
