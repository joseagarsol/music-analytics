import { useState, useMemo, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { getStoredToken } from '../services/auth';
import type { UserTokenResponse } from '../types/login';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(getStoredToken());

  useEffect(() => {
    const handleTokenRefresh = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setToken(customEvent.detail);
    };

    window.addEventListener('spotify_token_refreshed', handleTokenRefresh);

    return () => {
      window.removeEventListener('spotify_token_refreshed', handleTokenRefresh);
    };
  }, []);

  const login = (user: UserTokenResponse) => {
    window.localStorage.setItem('spotify_token', user.access_token);
    window.localStorage.setItem('spotify_refresh_token', user.refresh_token);
    setToken(user.access_token);
  };

  const logout = () => {
    window.localStorage.removeItem('spotify_token');
    window.localStorage.removeItem('spotify_code_verifier');
    setToken(null);
  };

  const value = useMemo(
    () => ({
      token,
      login,
      logout,
      isAuthenticated: !!token,
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
