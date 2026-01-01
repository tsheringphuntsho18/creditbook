import React, { useCallback } from 'react';
import { PhoneIcon } from './icons/PhoneIcon';
import { LockIcon } from './icons/LockIcon';
import OtpInput from './OtpInput';
import AuthLayout from './AuthLayout';
import { useAuth } from '../useAuth';
import { VendorRegistrationData } from '../types';

interface VendorLoginProps {
  onBack: () => void;
  onLoginSuccess: (phoneNumber: string) => void;
  showSuccessMessage?: boolean;
  vendors: VendorRegistrationData[];
}

const VendorLogin: React.FC<VendorLoginProps> = ({ onBack, onLoginSuccess, showSuccessMessage, vendors }) => {
  const validationFn = useCallback((payload: { phoneNumber: string; password?: string }) => {
    const vendor = vendors.find(v => v.phoneNumber === payload.phoneNumber);
    if (!vendor) {
      return 'No vendor found with this phone number.';
    }
    if (vendor.password !== payload.password) {
      return 'Incorrect password.';
    }
    return null;
  }, [vendors]);

  const {
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
  } = useAuth({ onLoginSuccess, validationFn });

  const title = otpSent ? 'Enter the code' : 'Vendor Login';

  return (
    <AuthLayout title={title} onBack={otpSent ? resetAuthState : onBack}>
      {showSuccessMessage && (
        <div className="bg-success/10 border-l-4 border-success text-success-dark dark:text-success-light p-4 rounded-md" role="alert">
          <p className="font-bold">Registration Successful!</p>
          <p>Please log in to continue.</p>
        </div>
      )}

      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="space-y-6">
           <p className="text-center text-sm text-content-light-secondary dark:text-content-dark-secondary">
             Enter your credentials to receive a secure OTP.
           </p>
          {error && (
            <div className="bg-danger/10 text-center text-sm text-danger-dark dark:text-danger-light p-3 rounded-md">
              <p>{error}</p>
            </div>
          )}
          <div>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon />
              </div>
              <input
                id="phone-number"
                name="phone-number"
                type="tel"
                autoComplete="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="appearance-none block w-full px-3 py-3 pl-10 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="8-digit mobile number"
              />
            </div>
          </div>
           <div>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-3 pl-10 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Send OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="space-y-6">
          <p className="text-center text-sm text-content-light-secondary dark:text-content-dark-secondary">
            Enter the 6-digit OTP sent to {phoneNumber}.
          </p>
           {error && (
            <div className="bg-danger/10 text-center text-sm text-danger-dark dark:text-danger-light p-3 rounded-md">
              <p>{error}</p>
            </div>
          )}
          <div>
            <label htmlFor="otp" className="sr-only">
              OTP
            </label>
            <OtpInput length={6} onChange={setOtp} />
          </div>
           <div className="text-center text-sm text-content-light-secondary dark:text-content-dark-secondary">
            {countdown > 0 ? (
                <p>Didn't get it? Resend in {countdown}s</p>
            ) : (
                <button
                    type="button"
                    onClick={handleResendOtp}
                    className="font-semibold text-primary hover:text-primary-light"
                >
                    Resend OTP
                </button>
            )}
           </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Login
          </button>
        </form>
      )}
    </AuthLayout>
  );
};

export default VendorLogin;