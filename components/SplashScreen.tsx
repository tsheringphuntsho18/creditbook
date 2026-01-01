import React from 'react';
import { Logo } from './icons/Logo';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-background-light-secondary dark:bg-background-dark-primary select-none">
      
      {/* Logo Animation Container */}
      <div className="relative h-16 w-16 animate-logo-pulse">
        {/* Left Half Container (Clipper) */}
        <div className="absolute left-0 h-16 w-8 overflow-hidden">
          <div className="absolute left-0 h-16 w-16 animate-logo-left">
            <Logo />
          </div>
        </div>
        
        {/* Right Half Container (Clipper) */}
        <div className="absolute right-0 h-16 w-8 overflow-hidden">
          <div className="absolute right-0 h-16 w-16 animate-logo-right">
            <Logo />
          </div>
        </div>
      </div>

      {/* Text Animation Container */}
      <div className="mt-4 flex w-full justify-center gap-1 overflow-x-hidden text-2xl font-bold tracking-wider text-content-light-primary dark:text-content-dark-primary">
        <span className="block animate-text-from-left opacity-0">Shop</span>
        <span className="block animate-text-from-right opacity-0">Connect</span>
      </div>

      <style>{`
        @keyframes slide-in-from-left {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-in-from-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        
        .animate-logo-left,
        .animate-logo-right {
          animation: slide-in-from-left 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-logo-right {
          animation-name: slide-in-from-right;
        }
        .animate-logo-pulse {
          animation: pulse-scale 0.6s ease-in-out 1s;
        }
        .animate-text-from-left,
        .animate-text-from-right {
          animation: slide-in-from-left 0.9s cubic-bezier(0.25, 1, 0.5, 1) 0.5s forwards;
        }
        .animate-text-from-right {
           animation-name: slide-in-from-right;
        }
        .opacity-0 {
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;