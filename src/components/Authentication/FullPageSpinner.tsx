import { useEffect } from 'react';
import { useUserContext } from '@/context/UserContext';
import { Loader2 } from 'lucide-react';

export default function FullPageSpinner() {
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

  return (
    <div className="flex h-screen items-center justify-center bg-background text-primary">
      <Loader2 className="animate-spin h-8 w-8" size={72} />
      <span className="ml-3 text-4xl font-medium">Making sure its you...</span>
    </div>
  );
}
