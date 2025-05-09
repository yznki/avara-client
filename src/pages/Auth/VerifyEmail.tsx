'use client';

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function VerifyEmail() {
  const query = useQuery();
  const email = query.get('email') || 'user@example.com';
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    console.log('Verifying email:', email, 'OTP:', otp);
    // TODO: API call to verify email
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold">Verify Your Email</h2>
          <p className="text-muted-foreground text-sm">
            Enter the 6-digit code we sent to <strong>{email}</strong>
          </p>
        </div>

        <InputOTP className="w-full" maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup className="w-full">
            {[...Array(6)].map((_, i) => (
              <InputOTPSlot className="w-full" key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <Button onClick={handleVerify} className="w-full">
          Verify
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Didn’t get the code?{' '}
          <Button variant="link" className="text-primary underline px-0 hover:cursor-pointer">
            Resend
          </Button>
        </p>
      </div>
    </div>
  );
}
