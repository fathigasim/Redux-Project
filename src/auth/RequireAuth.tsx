// RequireAuth.jsx
import {type ReactNode ,useState,useEffect} from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';


export default function RequireAuth({ children }: { children: ReactNode }) {
  const isAuthenticated = useSelector((state: any) => state.auth.token !== null);
  const [checking, setChecking] = useState(true);
  const location = useLocation();
  useEffect(() => {
    // Simulate small delay to rehydrate token
    const timer = setTimeout(() => setChecking(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (checking) {
    return <div>Loading...</div>; // or skeleton / spinner
  }

 // const accessToken = localStorage.getItem('accessToken');
  
  if (!isAuthenticated) {
    return <Navigate to={`/logins?redirect=${encodeURIComponent(location.pathname+ location.search)}`} replace />;
  }
  return children;
}
