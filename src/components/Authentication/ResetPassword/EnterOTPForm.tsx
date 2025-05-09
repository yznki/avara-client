'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface EnterOTPFormProps {
  email: string;
  onNext: () => void;
}

export default function EnterOTPForm({ email, onNext }: EnterOTPFormProps) {
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    console.log('Verifying OTP for', email, 'with code:', otp);
    // TODO: verify OTP with backend
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Enter Verification Code</h2>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to <strong>{email}</strong>. Please enter it below.
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
  );
}
