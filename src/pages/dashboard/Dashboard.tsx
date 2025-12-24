import { useState } from 'react';
import styles from './Dashboard.module.css';
import type { TimeRange } from '../../types/spotify';
import TrackList from '../../components/features/analytics/trackList/TrackList';
import TopArtistsList from '../../components/features/analytics/topArtistsList/TopArtistsList';
import GenreChart from '../../components/features/analytics/genreChart/GenreChart';
import ProfileButton from '../../components/features/user/ProfileButton';

type Tab = 'tracks' | 'artists' | 'genres';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('medium_term');
  const [activeTab, setActiveTab] = useState<Tab>('tracks');

  return (
    <>
      <div className={styles.profileContainer}>
        <ProfileButton />
      </div>
      <div className={styles.container}>
        <div className={styles.headerGradient} />
        <h1 className={styles.title}>Análisis Musical</h1>

        <div className={styles.timeFilter}>
          <button
            className={`${styles.timeBtn} ${timeRange === 'short_term' ? styles.activeTime : ''}`}
            onClick={() => setTimeRange('short_term')}
          >
            4 semanas
          </button>
          <button
            className={`${styles.timeBtn} ${timeRange === 'medium_term' ? styles.activeTime : ''}`}
            onClick={() => setTimeRange('medium_term')}
          >
            6 meses
          </button>
          <button
            className={`${styles.timeBtn} ${timeRange === 'long_term' ? styles.activeTime : ''}`}
            onClick={() => setTimeRange('long_term')}
          >
            Siempre
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'tracks' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('tracks')}
          >
            Top Canciones
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'artists' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('artists')}
          >
            Top Artistas
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'genres' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('genres')}
          >
            Análisis de Géneros
          </button>
        </div>

        <div className={styles.contentArea}>
          {activeTab === 'tracks' && <TrackList timeRange={timeRange} />}
          {activeTab === 'artists' && <TopArtistsList timeRange={timeRange} />}
          {activeTab === 'genres' && <GenreChart timeRange={timeRange} />}
        </div>
      </div>
    </>
  );
}