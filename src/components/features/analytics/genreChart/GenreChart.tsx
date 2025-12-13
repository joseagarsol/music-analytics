import { useState, useEffect } from 'react';
import styles from './GenreChart.module.css';
import type { TimeRange } from '../../../../types/spotify';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { useAuth } from '../../../../context/AuthContext';
import { getArtist } from '../../../../services/spotify';
import { getTopTracks } from '../../../../services/spotify';

interface Props {
  timeRange: TimeRange;
}

interface GenreData {
  name: string;
  value: number;
}

const COLORS = ['#1DB954', '#535353', '#B3B3B3', '#14813aff', '#888888'];

export default function GenreChart({ timeRange }: Props) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GenreData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataAndProcess = async () => {
      if (!token) return;
      setLoading(true);

      try {
        const fetchedTracks = await getTopTracks(token, timeRange, 20);

        if (fetchedTracks.length === 0) return;

        const allArtistIds = fetchedTracks.flatMap((t) =>
          t.artists.map((a) => a.id)
        );

        const uniqueArtistIds = [...new Set(allArtistIds)];

        const artistsFull = await getArtist(token, uniqueArtistIds);

        const genreCounts: Record<string, number> = {};

        artistsFull.forEach((artist) => {
          artist.genres.forEach((genre) => {
            const cleanGenre = genre.charAt(0).toUpperCase() + genre.slice(1);
            genreCounts[cleanGenre] = (genreCounts[cleanGenre] || 0) + 1;
          });
        });

        const sortedGenres = Object.entries(genreCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        setData(sortedGenres);
      } catch (error) {
        console.error(error);
        setError('Ocurrió un error al cargar tus géneros dominantes.');
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndProcess();
  }, [token, timeRange]);

  const renderContent = () => {
    if (loading) {
      return <div className={styles.loader}>Analizando ADN musical...🧬🎵</div>;
    }

    if (error) {
      return <p className={styles.errorMessage}>{error}</p>;
    }

    return (
      <>
        <h3 className={styles.title}>Tus géneros dominantes 🎧</h3>
        <p className={styles.subtitle}>Basado en tus artistas más escuchados</p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data as any}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
            >
              {data.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="var(--bg-principal)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-superficie)',
                border: 'none',
                borderRadius: '8px',
                color: 'var(--texto-principal)',
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </>
    );
  };

  return <div className={styles.container}>{renderContent()}</div>;
}
