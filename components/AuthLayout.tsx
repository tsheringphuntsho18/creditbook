import React from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  onBack: () => void;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, onBack }) => {
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-background-light-primary dark:bg-background-dark-secondary rounded-xl shadow-2xl relative">
      <button onClick={onBack} className="absolute top-4 left-4 text-content-light-secondary dark:text-content-dark-secondary hover:text-content-light-primary dark:hover:text-content-dark-primary transition-colors">
        <ArrowLeftIcon />
      </button>
      <h2 className="text-2xl font-bold text-center text-content-light-primary dark:text-content-dark-primary pt-4">{title}</h2>
      <div className="pt-2">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
