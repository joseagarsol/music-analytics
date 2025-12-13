import { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import type { TimeRange, Track } from '../../../../types/spotify';
import { getTopTracks } from '../../../../services/spotify';
import style from './TrackList.module.css';

interface Props {
  timeRange: TimeRange;
}

export default function TrackList({ timeRange }: Props) {
  const { token } = useAuth();
  const [isLoading, setLoading] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const tracks = await getTopTracks(token, timeRange, 20);
        setTracks(tracks);
      } catch (error) {
        console.error(error);
        setError('Ocurrió un error al cargar tus temazos favoritos.');
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [timeRange, token]);

  const renderContent = () => {
    if (isLoading) {
      return <div className={style.loading}>Cargando temazos...</div>;
    }

    if (error) {
      return <p className={style.errorMessage}>{error}</p>;
    }

    if (!tracks.length) {
      return (
        <p className={style.emptyStateMessage}>
          No se encontraron temazos para el rango de tiempo seleccionado. ¡Sigue
          escuchando música para generar tus estadísticas!
        </p>
      );
    }

    return (
      <div className={style.grid}>
        {tracks.map((track, index) => (
          <div key={track.id} className={style.trackCard}>
            <div className={style.trackImageContainer}>
              <div className={style.trackBadge}>{index + 1}</div>
              <img
                src={track.album.images[0]?.url}
                alt={track.name}
                className={style.trackImage}
              />
            </div>
            <div className={style.trackName} title={track.name}>
              {track.name}
            </div>
            <div className={style.artistName}>
              {track.artists.map((a) => a.name).join(', ')}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return <div className={style.container}>{renderContent()}</div>;
}
