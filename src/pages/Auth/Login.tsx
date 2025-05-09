import { Link } from 'react-router-dom';
import LoginForm from '@/components/Authentication/LoginForm';

export default function Login() {
  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8">
        <div className="w-full max-w-md space-y-6">
          <div className="w-full flex items-center">
            <img src="/logo.svg" alt="Avara Logo" className="" />
          </div>
          <div className="grid gap-2">
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="text-muted-foreground">Login to your Avara Inc account</p>
          </div>
          <LoginForm />
          <div className="mt-4 text-sm">
            Don’t have an account?{' '}
            <Link to="/sign-up" className="text-sm text-primary underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-1/2 h-screen overflow-hidden">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/auth/login-placeholder.png"
        >
          <source src="/auth/card.webm" type="video/webm" />
        </video>
      </div>
    </div>
  );
}
