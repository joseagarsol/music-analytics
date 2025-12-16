import { generateRandomString, generateCodeChallenge } from '../helpers';
import type { UserTokenResponse } from '../types/login';

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
  authUrl.searchParams.append(
    'scope',
    'user-read-private user-read-email user-top-read'
  );
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('code_challenge_method', 'S256');
  authUrl.searchParams.append('code_challenge', codeChallenge);

  window.location.href = authUrl.toString();
};

export const fetchAccessToken = async (
  code: string
): Promise<UserTokenResponse | null> => {
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

    const data: UserTokenResponse = await response.json();

    window.history.pushState({}, '', '/');

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getStoredToken = (): string | null => {
  return window.localStorage.getItem('spotify_token');
};

const getStoredRefreshToken = (): string | null => {
  return window.localStorage.getItem('spotify_refresh_token');
};

export const getRefreshToken = async (): Promise<UserTokenResponse | null> => {
  const refreshToken = getStoredRefreshToken();

  if (!refreshToken) {
    console.error('No refresh token found');
    return null;
  }

  const url = 'https://accounts.spotify.com/api/token';

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId!,
    }),
  };

  try {
    const response = await fetch(url, payload);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error refreshing token:', errorData);
      return null;
    }

    const data: UserTokenResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Network error refreshing token:', error);
    return null;
  }
};
