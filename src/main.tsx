import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { store } from './app/store'

import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { ThemeProvider } from './context/themeContext';
import 'bootstrap/dist/css/bootstrap.min.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>

      <ThemeProvider>
        
        
    <App />
    
    </ThemeProvider>
    </Provider>
  </StrictMode>,
)
