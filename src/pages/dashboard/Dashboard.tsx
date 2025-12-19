import { useState } from 'react';
import style from './Dashboard.module.css';
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
      <div className={style.profileContainer}>
        <ProfileButton />
      </div>
      <div className={style.container}>
        <h1 className={style.title}>Dashboard Musical</h1>

        <div className={style.timeFilter}>
          <button
            className={`${style.timeBtn} ${timeRange === 'short_term' ? style.activeTime : ''}`}
            onClick={() => setTimeRange('short_term')}
          >
            4 semanas
          </button>
          <button
            className={`${style.timeBtn} ${timeRange === 'medium_term' ? style.activeTime : ''}`}
            onClick={() => setTimeRange('medium_term')}
          >
            6 meses
          </button>
          <button
            className={`${style.timeBtn} ${timeRange === 'long_term' ? style.activeTime : ''}`}
            onClick={() => setTimeRange('long_term')}
          >
            Siempre
          </button>
        </div>

        <div className={style.tabs}>
          <button
            className={`${style.tabBtn} ${activeTab === 'tracks' ? style.activeTab : ''}`}
            onClick={() => setActiveTab('tracks')}
          >
            Top Canciones
          </button>
          <button
            className={`${style.tabBtn} ${activeTab === 'artists' ? style.activeTab : ''}`}
            onClick={() => setActiveTab('artists')}
          >
            Top Artistas
          </button>
          <button
            className={`${style.tabBtn} ${activeTab === 'genres' ? style.activeTab : ''}`}
            onClick={() => setActiveTab('genres')}
          >
            Análisis de Géneros
          </button>
        </div>

        <div className={style.contentArea}>
          {activeTab === 'tracks' && <TrackList timeRange={timeRange} />}
          {activeTab === 'artists' && <TopArtistsList timeRange={timeRange} />}
          {activeTab === 'genres' && <GenreChart timeRange={timeRange} />}
        </div>
      </div>
    </>
  );
}
