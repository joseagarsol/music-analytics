import { createContext, useContext } from 'react';
import type { UserTokenResponse } from '../types/login';
import type { SpotifyUser } from '../types/spotify';

interface AuthContextType {
  token: string | null;
  user: SpotifyUser | null;
  login: (user: UserTokenResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};
