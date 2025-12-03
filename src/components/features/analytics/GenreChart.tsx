import { useState, useEffect } from 'react';
import styles from './GenreChart.module.css';
import { type Track } from '../../../types/spotify';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { getArtist } from '../../../services/spotify';

interface Props {
  tracks: Track[];
}

interface GenreData {
  name: string;
  value: number;
}

const COLORS = ['#1DB954', '#535353', '#B3B3B3', '#14813aff', '#888888'];

export default function GenreChart({ tracks }: Props) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GenreData[]>([]);

  useEffect(() => {
    const processGenres = async () => {
      if (!token || tracks.length === 0) return;
      setLoading(true);

      try {
        const allArtistIds = tracks.flatMap((t) => t.artists.map((a) => a.id));

        const artistsFull = await getArtist(token, allArtistIds);

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
        console.error('Error procesando géneros:', error);
      } finally {
        setLoading(false);
      }
    };

    processGenres();
  }, [tracks, token]);

  if (tracks.length === 0) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Tus géneros dominantes 🎧</h3>
      <p className={styles.subtitle}>Basado en tus artistas más escuchados</p>

      {loading ? (
        <div className={styles.loader}>Analizando ADN musical...🧬🎵</div>
      ) : (
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
              {data.map((entry, index) => (
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
      )}
    </div>
  );
}
