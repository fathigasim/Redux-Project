import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { store } from './app/store'

import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { ThemeProvider } from './context/themeContext';
import { BrowserRouter } from 'react-router'
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
    <App />
    </BrowserRouter>
    </ThemeProvider>
    </Provider>
  </StrictMode>,
)
