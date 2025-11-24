import { useState, useMemo } from 'react';
import { AuthContext } from './AuthContext';

const getStoredToken = () => {
  return window.localStorage.getItem('spotify_token');
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(getStoredToken());

  const login = (token: string) => {
    setToken(token);
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
