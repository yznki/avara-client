import { Link } from 'react-router-dom';
import OAuthButton from '@/components/Authentication/OAuthButton';
import SignUpForm from '@/components/Authentication/SignUpForm';

export default function SignUp() {
  //TODO: Auth0
  function handleOAuthLogin(provider: 'google' | 'github') {
    console.log('Sign up with', provider);
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block w-1/2 h-screen overflow-hidden">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster="/auth/signup-placeholder.png"
        >
          <source src="/auth/atm.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8">
        <div className="w-full max-w-md space-y-6">
          <div className="w-full flex items-center">
            <img src="/logo.svg" alt="Avara Logo" className="" />
          </div>
          <div className="grid gap-2">
            <h2 className="text-3xl font-bold">Create an Account</h2>
            <p className="text-muted-foreground">Sign up for an Avara Inc account</p>
          </div>
          <SignUpForm />
          <div className="space-y-2 mt-6">
            <div className="relative text-center text-sm text-muted-foreground">
              <span className="bg-background px-4 relative z-10">or continue with</span>
              <div className="absolute top-1/2 w-full border-t left-0 -z-0"></div>
            </div>
            <OAuthButton provider="google" onClick={() => handleOAuthLogin('google')} />
            <OAuthButton provider="github" onClick={() => handleOAuthLogin('github')} />
          </div>
          <div className="flex items-center text-sm mt-4 gap-2">
            <span className="text-muted-foreground">Already have an account?</span>
            <Link to="/login" className="text-primary underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
