
import React from 'react';

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  onText?: string;
  offText?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onToggle, onText = "Open", offText = "Closed" }) => {
  return (
    <div className="flex items-center">
      <button
        onClick={onToggle}
        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
          isOn ? 'bg-success' : 'bg-gray-300 dark:bg-gray-600'
        }`}
        role="switch"
        aria-checked={isOn}
      >
        <span
          aria-hidden="true"
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
            isOn ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <span className="ml-3 text-sm font-medium text-content-light-primary dark:text-content-dark-primary">
        <span className={isOn ? 'text-success font-bold' : 'text-content-light-secondary dark:text-content-dark-secondary'}>{isOn ? onText : offText}</span>
      </span>
    </div>
  );
};

export default ToggleSwitch;