import { ShieldOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRoleBasedThemeStyle } from '@/lib/useRoleBasedThemeStyle';
import { Button } from '@/components/ui/button';

export default function Unauthorized() {
  useRoleBasedThemeStyle();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <ShieldOff className="w-16 h-16 mb-4 text-gray-400" />
      <h1 className="text-4xl font-bold mb-2">403 – Unauthorized</h1>
      <p className="text-gray-500 mb-6 max-w-md">
        You don’t have permission to access this page. If you believe this is a mistake, contact
        your administrator.
      </p>
      <Button asChild>
        <Link to="/">← Back to Dashboard</Link>
      </Button>
    </div>
  );
}
