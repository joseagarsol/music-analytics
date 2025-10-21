import { generateRandomString, generateCodeChallenge } from '../helpers';

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

export const redirectToSpotifyAuth = async () => {
  if (!clientId || !redirectUri) {
    console.error(
      'Client ID o Redirect URI no configurados en el fichero .env.local'
    );
    return;
  }

  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  window.localStorage.setItem('spotify_code_verifier', codeVerifier);

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('scope', 'user-top-read');
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('code_challenge_method', 'S256');
  authUrl.searchParams.append('code_challenge', codeChallenge);

  window.location.href = authUrl.toString();
};

export const fetchAccessToken = async (
  code: string
): Promise<string | null> => {
  const codeVerifier = window.localStorage.getItem('spotify_code_verifier');

  if (!codeVerifier) {
    console.error('Code verifier no encontrado en el storage.');
    return null;
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri!,
    client_id: clientId!,
    code_verifier: codeVerifier,
  });

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error al obtener el token: ${errorData.error_description}`
      );
    }

    const data = await response.json();
    window.localStorage.setItem('spotify_token', data.access_token);

    window.history.pushState({}, '', '/');

    return data.access_token;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const logout = () => {
  window.localStorage.removeItem('spotify_token');
  window.localStorage.removeItem('spotify_code_verifier');
};

export const getStoredToken = (): string | null => {
  return window.localStorage.getItem('spotify_token');
};
