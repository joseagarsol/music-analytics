import { Link } from 'wouter';
import { useAuth } from '../../context/AuthContext';
import styles from './UserProfile.module.css';

export default function UserProfile() {
  const auth = useAuth();
  const profile = auth.user;

  if (!profile) {
    return null;
  }

  return (
    <main className={styles.container}>
      <div className={styles.headerGradient} />

      <div className={styles.content}>
        <div className={styles.avatarContainer}>
          {profile.images && profile.images.length > 0 ? (
            <img
              src={profile.images[0].url}
              alt={profile.display_name}
              className={styles.avatarImage}
            />
          ) : (
            <div className={styles.initialsAvatar}>
              {profile.display_name ? profile.display_name.charAt(0) : '?'}
            </div>
          )}
        </div>

        <h1 className={styles.displayName}>{profile.display_name}</h1>

        <div className={styles.statsContainer}>
          <span className={styles.statsNumber}>
            {new Intl.NumberFormat().format(profile.followers.total)}
          </span>
          <span className={styles.statsLabel}>Seguidores</span>
        </div>

        <div className={styles.actions}>
          <Link
            to="/dashboard"
            className={`${styles.buttonBase} ${styles.primaryButton}`}
          >
            Dashboard Musical
          </Link>
          <a
            href={profile.external_urls.spotify}
            target="_blank"
            rel="noreferrer"
            className={`${styles.buttonBase} ${styles.primaryButton}`}
          >
            Abrir en Spotify
          </a>
          <a
            onClick={auth.logout}
            className={`${styles.buttonBase} ${styles.secondaryButton}`}
          >
            Cerrar Sesión
          </a>
        </div>
      </div>
    </main>
  );
}
