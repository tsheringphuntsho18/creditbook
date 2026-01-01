import React, { useCallback } from 'react';
import { PhoneIcon } from './icons/PhoneIcon';
import { Customer } from '../types';
import OtpInput from './OtpInput';
import AuthLayout from './AuthLayout';
import { useAuth } from '../useAuth';

interface CustomerLoginProps {
  onBack: () => void;
  onLoginSuccess: (customer: Customer) => void;
  customers: Customer[];
}

const CustomerLogin: React.FC<CustomerLoginProps> = ({ onBack, onLoginSuccess, customers }) => {

  const validationFn = useCallback((payload: { phoneNumber: string; password?: string }) => {
    const customerExists = customers.some(c => c.phoneNumber === payload.phoneNumber);
    if (!customerExists) {
      return 'No customer found with this phone number.';
    }
    return null;
  }, [customers]);
  
  const handleLoginSuccess = useCallback((phone: string) => {
    const customer = customers.find(c => c.phoneNumber === phone);
    if (customer) {
      onLoginSuccess(customer);
    } else {
      console.error("Login success callback triggered for a non-existent customer.");
    }
  }, [customers, onLoginSuccess]);
  
  const {
    phoneNumber,
    setPhoneNumber,
    setOtp,
    otpSent,
    error,
    countdown,
    handleSendOtp,
    handleLogin,
    handleResendOtp,
    resetAuthState,
  } = useAuth({ 
      onLoginSuccess: handleLoginSuccess, 
      validationFn 
  });
  
  const title = otpSent ? 'Enter the code' : 'Customer Login';

  return (
    <AuthLayout title={title} onBack={otpSent ? resetAuthState : onBack}>
      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="space-y-6">
           <p className="text-center text-sm text-content-light-secondary dark:text-content-dark-secondary">
             Enter the phone number registered with your shop to log in.
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
                    className="appearance-none block w-full px-3 py-3 pl-10 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-success focus:border-success sm:text-sm"
                    placeholder="8-digit mobile number"
                />
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-success hover:bg-success-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success"
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
             <label htmlFor="otp" className="sr-only">OTP</label>
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
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-success hover:bg-success-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success"
          >
            Login
          </button>
        </form>
      )}
    </AuthLayout>
  );
};

export default CustomerLogin;