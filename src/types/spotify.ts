export type TimeRange = 'short_term' | 'medium_term' | 'long_term';

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface Artist {
  name: string;
  id: string;
  external_urls: { spotify: string };
}

export interface Album {
  name: string;
  images: SpotifyImage[];
  release_date: string;
}

export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  external_urls: { spotify: string };
  popularity: number;
  duration_ms: number;
}

export interface ArtistFull {
  id: string;
  name: string;
  images: SpotifyImage[];
  genres: string[];
  popularity: number;
}
