import { useUserContext } from '@/context/UserContext';
import AdminGuard from '@/components/AdminGuard';
import AdminDashboard from './Admin/Dashboard';
import UserDashboard from './User/UserDashboard';

const Dashboard = () => {
  const { user, isBackendLoading } = useUserContext();

  if (isBackendLoading) return null;

  return user?.role === 'admin' ? (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  ) : (
    <UserDashboard />
  );
};

export default Dashboard;
