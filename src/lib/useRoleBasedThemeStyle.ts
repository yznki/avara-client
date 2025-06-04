import { useEffect } from 'react';
import { useUserContext } from '@/context/UserContext';

export function useRoleBasedThemeStyle() {
  const { user, isBackendLoading } = useUserContext();

  useEffect(() => {
    const html = document.documentElement;

    if (!isBackendLoading) {
      if (user?.role === 'admin') {
        html.classList.add('admin');
      } else {
        html.classList.remove('admin');
      }
    }

    return () => {
      html.classList.remove('admin');
    };
  }, [user?.role, isBackendLoading]);
}
