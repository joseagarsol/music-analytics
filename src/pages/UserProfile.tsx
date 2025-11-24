import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
  };

  return (
    <div>
      <p>¡Has iniciado sesión con PKCE!</p>
      <Button onClick={handleLogout} text="Cerrar sesión" />
    </div>
  );
}
