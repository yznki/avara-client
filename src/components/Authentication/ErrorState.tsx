import { AlertTriangle } from 'lucide-react';

export default function ErrorState({ message }: { message?: string }) {
  return (
    <div className="flex h-screen items-center justify-center bg-background text-destructive">
      <div className="flex items-center space-x-3">
        <AlertTriangle className="h-6 w-6" />
        <p className="text-lg font-medium">
          {message || 'Something went wrong. Please try again.'}
        </p>
      </div>
    </div>
  );
}
