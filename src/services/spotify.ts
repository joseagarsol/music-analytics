import { type TimeRange, type Track, type ArtistFull } from '../types/spotify';

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
    const response = await fetch(
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
      if (response.status === 401) {
        throw new Error('TOKEN EXPIRED');
      }
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

  const response = await fetch(
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

  const response = await fetch(
    `https://api.spotify.com/v1/me/top/artists?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('TOKEN EXPIRED');
    }
    throw new Error('Error fetching top artist');
  }

  const data: TopArtistsResponse = await response.json();
  return data.items;
};
