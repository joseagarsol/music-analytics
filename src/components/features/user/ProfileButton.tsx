import { useState, useRef, useEffect } from 'react';
import style from './ProfileButton.module.css';
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'wouter';

export default function ProfileButton() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const auth = useAuth();
  const profile = auth.user;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!profile) {
    return null;
  }

  return (
    <div className={style.wrapper} ref={wrapperRef}>
      <div className={style.containerButton} onClick={() => setIsOpen(!isOpen)}>
        {profile.images && profile.images.length > 0 ? (
          <img
            src={profile.images[0].url}
            alt={profile.display_name}
            className={style.avatarImage}
          />
        ) : (
          <div className={style.initialsAvatar}>
            {profile.display_name ? profile.display_name.charAt(0) : '?'}
          </div>
        )}
      </div>

      {isOpen && (
        <div className={style.dropdownMenu}>
          <Link className={style.menuItem} to="/profile">
            Ver Perfil
          </Link>
          <a className={style.menuItem} onClick={auth.logout}>
            Cerrar Sesión
          </a>
        </div>
      )}
    </div>
  );
}
