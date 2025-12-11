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

  useEffect(() => {
    const fetchTracks = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const tracks = await getTopTracks(token, timeRange, 20);
        setTracks(tracks);
      } catch (error) {
        console.error('Error fetching top tracks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [timeRange, token]);

  if (isLoading)
    return <div className={style.loading}>Cargando temazos...</div>;

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
}
