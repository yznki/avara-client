import { Ghost } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <Ghost className="w-16 h-16 mb-4 text-gray-400" />
      <h1 className="text-4xl font-bold mb-2">404 – Page Not Found</h1>
      <p className="text-gray-500 mb-6 max-w-md">
        The page you're looking for doesn't exist or has been moved. Maybe double check the URL?
      </p>
      <Button asChild>
        <Link to="/">← Back to Dashboard</Link>
      </Button>
    </div>
  );
}
