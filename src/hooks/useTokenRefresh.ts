import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { refreshAccessToken } from '../features/authSlice';

export const useTokenRefresh = () => {
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);

  useEffect(() => {
    if (!refreshToken) return;

    const interval = setInterval(() => {
      dispatch(refreshAccessToken());
    }, 60000); // every 60s

    return () => clearInterval(interval);
  }, [dispatch, refreshToken]);
};
