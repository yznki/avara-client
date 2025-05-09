import { Link } from 'react-router-dom';
import SignUpForm from '@/components/Authentication/SignUpForm';

export default function SignUpSecond() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background Image */}
      <img
        src="/auth/atm-hero.gif"
        alt="ATM Background"
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />

      {/* Logo */}
      <div className="absolute top-6 left-6 text-white text-xl font-bold flex items-center gap-2">
        <img src="/logo.svg" alt="Avara Logo" className="h-6 w-6" />
        <span>Avara</span>
      </div>

      {/* Centered Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md rounded-2xl bg-white/90 shadow-xl backdrop-blur-sm p-8">
          <div className="text-2xl font-bold">Create an Account</div>
          <p className="text-muted-foreground mb-4">Sign up for an Avara Inc account</p>
          <SignUpForm />
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
