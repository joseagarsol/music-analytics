import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './TopTracks.module.css';
import { getTopTracks } from '../services/spotify';
import type { TimeRange, Track } from '../types/spotify';
import GenreChart from '../components/features/analytics/GenreChart';
import TopArtistsList from '../components/features/analytics/TopArtistsList';

export default function TopTracks() {
  const { token, logout } = useAuth();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('medium_term');

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);

      try {
        const data = await getTopTracks(token, timeRange, 20);
        setTracks(data);
      } catch (error) {
        console.error(error);
        if (error instanceof Error && error.message === 'TOKEN EXPIRED') {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, logout, timeRange]);

  return (
    <div className={styles.container}>
      <div className={styles.headerGradient} />

      <div className={styles.content}>
        <h1 className={styles.title}>Tus canciones más escuchadas</h1>

        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${timeRange === 'short_term' ? styles.activeFilter : ''}`}
            onClick={() => setTimeRange('short_term')}
          >
            Últimas 4 semanas
          </button>
          <button
            className={`${styles.filterButton} ${timeRange === 'medium_term' ? styles.activeFilter : ''}`}
            onClick={() => setTimeRange('medium_term')}
          >
            Últimos 6 meses
          </button>
          <button
            className={`${styles.filterButton} ${timeRange === 'long_term' ? styles.activeFilter : ''}`}
            onClick={() => setTimeRange('long_term')}
          >
            Desde siempre
          </button>
        </div>

        {!loading && tracks.length > 0 && <GenreChart tracks={tracks} />}

        {loading ? (
          <div className={styles.loading}> Cargando tus temazos... 🤘🎵🧨</div>
        ) : (
          <div className={styles.grid}>
            {tracks.map((track, index) => (
              <div key={track.id} className={styles.trackCard}>
                <div className={styles.trackImagecontainer}>
                  <div className={styles.rankBadge}>{index + 1}</div>

                  <img
                    src={track.album.images[0]?.url}
                    alt={track.name}
                    className={styles.trackImage}
                  />
                </div>

                <div title={track.name} className={styles.trackName}>
                  {track.name}
                </div>

                <div className={styles.artistName}>
                  {track.artists.map((a) => a.name).join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}
        <TopArtistsList />
      </div>
    </div>
  );
}
