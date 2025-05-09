'use client';

import { useState } from 'react';
import EnterEmailForm from '@/components/Authentication/ResetPassword/EnterEmailForm';
import EnterOTPForm from '@/components/Authentication/ResetPassword/EnterOTPForm';
import ResetPasswordForm from '@/components/Authentication/ResetPassword/ResetPasswordForm';

export default function ResetPasswordPage() {
  const [step, setStep] = useState<'email' | 'otp' | 'newPassword'>('email');
  const [email, setEmail] = useState('');

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex justify-center items-center px-8">
        <div className="w-full max-w-md space-y-6">
          {step === 'email' && (
            <EnterEmailForm
              onNext={(e) => {
                setEmail(e);
                setStep('otp');
              }}
            />
          )}
          {step === 'otp' && <EnterOTPForm email={email} onNext={() => setStep('newPassword')} />}
          {step === 'newPassword' && <ResetPasswordForm email={email} />}
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
