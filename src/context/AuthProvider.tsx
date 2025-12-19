import { useState, useMemo, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { getStoredToken } from '../services/auth';
import { getUserProfile } from '../services/spotify';
import type { UserTokenResponse } from '../types/login';
import type { SpotifyUser } from '../types/spotify';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [user, setUser] = useState<SpotifyUser | null>(null);

  useEffect(() => {
    const handleTokenRefresh = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setToken(customEvent.detail);
    };

    window.addEventListener('spotify_token_refreshed', handleTokenRefresh);

    if (token) {
      getUserProfile(token)
        .then((userData) => {
          setUser(userData);
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
        });
    } else {
      setUser(null);
    }

    return () => {
      window.removeEventListener('spotify_token_refreshed', handleTokenRefresh);
    };
  }, [token]);

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
      user,
      login,
      logout,
      isAuthenticated: !!token,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
