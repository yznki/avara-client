import { useEffect } from 'react';
import { useUserContext } from '@/context/UserContext';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { loginWithRedirect, isAuthenticated, isLoading: isAuthLoading } = useAuth0();
  const { user, isBackendLoading, isLoggedOut } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthLoading || isBackendLoading) return;

    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    if (!user?._id && !isLoggedOut) {
      navigate('/error');
    }
  }, [isAuthenticated, isAuthLoading, isBackendLoading, user, navigate]);

  if (isAuthLoading || isBackendLoading || !isAuthenticated || (!user?._id && !isLoggedOut))
    return null;

  return <>{children}</>;
};

export default AuthGuard;
