import { useUserContext } from '@/context/UserContext';
import { Navigate, useLocation } from 'react-router-dom';
import FullPageSpinner from './Authentication/FullPageSpinner';

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isBackendLoading } = useUserContext();
  const location = useLocation();

  if (isBackendLoading) return <FullPageSpinner />;

  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;
