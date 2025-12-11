import { useState, useEffect } from 'react';
import styles from './TopArtistsList.module.css';
import type { TimeRange, ArtistFull } from '../../../../types/spotify';
import { useAuth } from '../../../../context/AuthContext';
import { getTopArtists } from '../../../../services/spotify';

interface Props {
  timeRange: TimeRange;
}

export default function TopArtistsList({ timeRange }: Props) {
  const [artists, setArtists] = useState<ArtistFull[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchArtists = async () => {
      if (!token) return;

      setLoading(true);
      setError(null);
      try {
        const data = await getTopArtists(token, timeRange, 10);
        setArtists(data);
      } catch (error) {
        console.error(error);
        setError('Ocurrió un error al cargar tus artistas favoritos.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [token, timeRange]);

  const renderContent = () => {
    if (loading) {
      return <p className={styles.emptyStateMessage}>Cargando...</p>;
    }

    if (error) {
      return <p className={styles.errorMessage}>{error}</p>;
    }

    if (!artists.length) {
      return (
        <p className={styles.emptyStateMessage}>
          No hay artistas principales disponibles para este período. ¡Sigue
          escuchando música para generar tus estadísticas!
        </p>
      );
    }

    return (
      <div className={styles.list}>
        {artists.map((artist, index) => (
          <a
            key={artist.id}
            href={artist.external_urls?.spotify}
            target="_blank"
            rel="noreferrer"
            className={styles.artistCard}
          >
            <div className={styles.rankBadge}>{index + 1}</div>
            <img
              src={artist.images[0]?.url}
              alt={artist.name}
              className={styles.image}
            />
            <span className={styles.name}>{artist.name}</span>
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Tus artistas favoritos ⭐️</h3>
      </div>
      {renderContent()}
    </div>
  );
}
