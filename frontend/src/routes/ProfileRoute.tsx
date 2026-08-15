import { useAuth } from '../context/useAuth';
import { Navigate } from 'react-router-dom';

const ProfileRoute = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to='/auth' />;
  if (user.role === 'shop') return <Navigate to='/dashboard' />;
  if (user.role === 'user') return <Navigate to='/profile' />;
  return null;
};

export default ProfileRoute;
