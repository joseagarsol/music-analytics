import { useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { redirectToSpotifyAuth, fetchAccessToken } from '../services/spotify';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [location, setLocation] = useLocation();
  const auth = useAuth();

  const getAccessToken = useCallback(
    async (code: string) => {
      const accessToken = await fetchAccessToken(code);
      if (accessToken) {
        auth.login(accessToken);
        setLocation('/profile');
      }
    },
    [setLocation, auth]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      getAccessToken(code);
    }
  }, [location, getAccessToken]);

  return (
    <main className="main-container">
      <h1>Spotify Music Analyst</h1>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="96"
        height="96"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="icon icon-tabler icons-tabler-outline icon-tabler-brand-spotify"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M8 11.973c2.5 -1.473 5.5 -.973 7.5 .527" />
        <path d="M9 15c1.5 -1 4 -1 5 .5" />
        <path d="M7 9c2 -1 6 -2 10 .5" />
      </svg>
      <Button
        onClick={redirectToSpotifyAuth}
        text="Iniciar sesión con Spotify"
      />
    </main>
  );
}
