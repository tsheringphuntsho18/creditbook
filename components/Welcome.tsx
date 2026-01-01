import React from 'react';
import { Logo } from './icons/Logo';

interface WelcomeProps {
  onVendorLogin: () => void;
  onCustomerLogin: () => void;
  onRegisterShop: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onVendorLogin, onCustomerLogin, onRegisterShop }) => {
  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-background-light-primary dark:bg-background-dark-secondary rounded-2xl shadow-2xl text-center">
      <div className="flex justify-center">
        <Logo />
      </div>
      <div className="space-y-2">
         <h1 className="text-3xl md:text-4xl font-bold text-content-light-primary dark:text-content-dark-primary">
            Simple credit,
            <br />
            perfectly clear.
         </h1>
         <p className="text-content-light-secondary dark:text-content-dark-secondary">
           The trusted way for shops and customers to track credit balances.
         </p>
      </div>
      <div className="space-y-4 pt-4">
        <button
          onClick={onVendorLogin}
          className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-light transition-transform duration-200 transform hover:scale-105 shadow-lg"
        >
          I'm a Shopkeeper
        </button>
        <button
          onClick={onCustomerLogin}
          className="w-full bg-background-light-secondary dark:bg-background-dark-primary text-content-light-primary dark:text-content-dark-primary font-semibold py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 transform hover:scale-105 border border-gray-200 dark:border-gray-700 shadow-md"
        >
          I'm a Customer
        </button>
      </div>
      <div className="pt-4">
        <p className="text-sm text-content-light-secondary dark:text-content-dark-secondary">
          First time here?{' '}
          <button
            onClick={onRegisterShop}
            className="font-semibold text-primary hover:text-primary-light transition-colors duration-200"
          >
            Register your shop
          </button>
        </p>
      </div>
    </div>
  );
};

export default Welcome;
