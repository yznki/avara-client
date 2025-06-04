import { Loader2 } from 'lucide-react';
import { useRoleBasedThemeStyle } from '@/lib/useRoleBasedThemeStyle';

export default function FullPageSpinner() {
  useRoleBasedThemeStyle();

  return (
    <div className="flex h-screen items-center justify-center bg-background text-primary">
      <Loader2 className="animate-spin h-8 w-8" size={72} />
      <span className="ml-3 text-4xl font-medium">Making sure its you...</span>
    </div>
  );
}
