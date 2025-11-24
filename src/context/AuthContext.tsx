import { createContext, useContext } from 'react';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContextTypeNull: AuthContextType = {
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
};

export const AuthContext = createContext<AuthContextType>(AuthContextTypeNull);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};
