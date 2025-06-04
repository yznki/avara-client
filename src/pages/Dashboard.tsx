import { useUserContext } from '@/context/UserContext';
import AdminDashboard from './Admin/Dashboard';
import UserDashboard from './UserDashboard';

const Dashboard = () => {
  const { user, isBackendLoading } = useUserContext();

  if (isBackendLoading) return null;

  return user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;
