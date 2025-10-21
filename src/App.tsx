import { useEffect, useState, useRef, useCallback } from 'react';
import {
  redirectToSpotifyAuth,
  fetchAccessToken,
  logout,
  getStoredToken,
} from './services/spotify';

export default function App() {
  const [token, setToken] = useState<string | null>(getStoredToken());
  const hasFetched = useRef(false);

  const handleAuthCallback = useCallback(async (code: string) => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const accessToken = await fetchAccessToken(code);
    if (accessToken) {
      setToken(accessToken);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      handleAuthCallback(code);
    }
  }, [handleAuthCallback]);

  const handleLogin = () => {
    redirectToSpotifyAuth();
  };

  const handleLogout = () => {
    logout();
    setToken(null);
  };

  return (
    <div>
      <h1>Spotify Music Analyst</h1>
      {!token ? (
        <button onClick={handleLogin}>Iniciar sesión con Spotify</button>
      ) : (
        <div>
          <p>¡Has iniciado sesión con PKCE!</p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}
