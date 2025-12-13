import { useAuth } from '../../context/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import styles from './UserProfile.module.css';

interface UserProfileData {
  display_name: string;
  email: string;
  images: { url: string }[];
  followers: { total: number };
  external_urls: { spotify: string };
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const auth = useAuth();

  const handleLogout = useCallback(() => {
    auth.logout();
  }, [auth]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = window.localStorage.getItem('spotify_token');

      if (!token) {
        handleLogout();
        return;
      }

      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error detallado de Spotify:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
          });
          throw new Error(
            `Error al obtener el perfil: ${response.status} ${JSON.stringify(
              errorData
            )}`
          );
        }

        const data = await response.json();

        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile: ', error);
        // No hacemos logout automático para que puedas ver el error en consola
        // handleLogout();
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [handleLogout]);

  if (loading) {
    return <p>Cargando perfil...</p>;
  }

  if (!profile) {
    return null;
  }

  return (
    <main className={styles.container}>
      <div className={styles.headerGradient} />

      <div className={styles.content}>
        <div className={styles.avatarContainer}>
          <img
            src={profile.images[0].url}
            alt={profile.display_name}
            className={styles.avatarImage}
          />
        </div>

        <h1 className={styles.displayName}>{profile.display_name}</h1>

        <div className={styles.statsContainer}>
          <span className={styles.statsNumber}>
            {new Intl.NumberFormat().format(profile.followers.total)}
          </span>
          <span className={styles.statsLabel}>Seguidores</span>
        </div>

        <div className={styles.actions}>
          <a
            href={profile.external_urls.spotify}
            target="_blank"
            rel="noreferrer"
            className={`${styles.buttonBase} ${styles.primaryButton}`}
          >
            Abrir en Spotify
          </a>

          <button
            onClick={handleLogout}
            className={`${styles.buttonBase} ${styles.secondaryButton}`}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </main>
  );
}
