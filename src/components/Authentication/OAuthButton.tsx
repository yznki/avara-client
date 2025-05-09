import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';

interface OAuthButtonProps {
  provider: 'google' | 'github';
  onClick: () => void;
}

export default function OAuthButton({ provider, onClick }: OAuthButtonProps) {
  const icons = {
    google: <FcGoogle className="h-5 w-5" />,
    github: <FaGithub className="h-5 w-5" />,
  };

  const labels = {
    google: 'Google',
    github: 'Github',
  };

  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="w-full border rounded-md text-base font-medium justify-center gap-2 py-5 transition-all duration-300 hover:cursor-pointer"
    >
      {icons[provider]}
      {labels[provider]}
    </Button>
  );
}
