import { type TimeRange, type Track, type ArtistFull } from '../types/spotify';
import { getRefreshToken } from './auth';
import type { UserTokenResponse } from '../types/login';

interface TopTracksResponse {
  items: Track[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  previous: string | null;
  next: string | null;
}

interface ArtistResponse {
  artists: ArtistFull[];
}

interface TopArtistsResponse {
  items: ArtistFull[];
}

let refreshPromise: Promise<UserTokenResponse | null> | null = null;

const fetchWithAuth = async (
  input: string,
  init?: RequestInit
): Promise<Response> => {
  let response = await fetch(input, init);

  if (response.status === 401) {
    if (!refreshPromise) {
      refreshPromise = getRefreshToken()
        .then((newTokenData) => {
          if (newTokenData) {
            window.localStorage.setItem(
              'spotify_token',
              newTokenData.access_token
            );
            if (newTokenData.refresh_token) {
              window.localStorage.setItem(
                'spotify_refresh_token',
                newTokenData.refresh_token
              );
            }

            window.dispatchEvent(
              new CustomEvent('spotify_token_refreshed', {
                detail: newTokenData.access_token,
              })
            );
          }
          return newTokenData;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    const newTokenData = await refreshPromise;

    if (newTokenData) {
      const newInit = { ...init };
      newInit.headers = {
        ...newInit.headers,
        Authorization: `Bearer ${newTokenData.access_token}`,
      };

      response = await fetch(input, newInit);
    }
  }

  return response;
};

export const getTopTracks = async (
  token: string,
  timeRange: TimeRange = 'medium_term',
  limit: number = 20
): Promise<Track[]> => {
  const params = new URLSearchParams({
    time_range: timeRange,
    limit: limit.toString(),
    offset: '0',
  });

  try {
    const response = await fetchWithAuth(
      `https://api.spotify.com/v1/me/top/tracks?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching top tracks: ${response.statusText}`);
    }

    const data: TopTracksResponse = await response.json();
    return data.items;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getArtist = async (
  token: string,
  artistIds: string[]
): Promise<ArtistFull[]> => {
  const uniqueIds = [...new Set(artistIds)];
  const idsString = uniqueIds.join(',');

  const response = await fetchWithAuth(
    `https://api.spotify.com/v1/artists?ids=${idsString}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Error fetching artist');
  }

  const data: ArtistResponse = await response.json();
  return data.artists;
};

export const getTopArtists = async (
  token: string,
  timeRange: TimeRange = 'medium_term',
  limit: number = 20
): Promise<ArtistFull[]> => {
  const params = new URLSearchParams({
    time_range: timeRange,
    limit: limit.toString(),
  });

  const response = await fetchWithAuth(
    `https://api.spotify.com/v1/me/top/artists?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Error fetching top artist');
  }

  const data: TopArtistsResponse = await response.json();
  return data.items;
};
