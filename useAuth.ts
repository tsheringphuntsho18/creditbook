// FIX: Import the 'React' namespace to resolve 'Cannot find namespace' errors for types like 'React.FormEvent'.
import React, { useState, useEffect, useCallback } from 'react';

interface UseAuthProps {
  onLoginSuccess: (phoneNumber: string) => void;
  validationFn?: (payload: { phoneNumber: string; password?: string }) => string | null; // Returns error message or null
}

export const useAuth = ({ onLoginSuccess, validationFn }: UseAuthProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(c => c - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const handleSendOtp = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (phoneNumber.length !== 8) {
      setError('Phone number must be exactly 8 digits.');
      return;
    }

    if (validationFn) {
      const validationError = validationFn({ phoneNumber, password });
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    console.log("Sending OTP to", phoneNumber);
    setOtpSent(true);
    setCountdown(30);
  }, [phoneNumber, password, validationFn]);

  const handleResendOtp = useCallback(() => {
    console.log("Resending OTP to", phoneNumber);
    setCountdown(30);
  }, [phoneNumber]);

  const handleLogin = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp === '123456') { // Mock OTP
      onLoginSuccess(phoneNumber);
    } else {
      setError('Invalid OTP. Please try again.');
    }
  }, [otp, onLoginSuccess, phoneNumber]);
  
  const resetAuthState = useCallback(() => {
    setOtpSent(false);
    setError('');
  }, []);

  return {
    phoneNumber,
    setPhoneNumber,
    password,
    setPassword,
    setOtp,
    otpSent,
    error,
    countdown,
    handleSendOtp,
    handleResendOtp,
    handleLogin,
    resetAuthState,
  };
};