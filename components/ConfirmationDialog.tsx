
import React from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  variant?: 'danger' | 'primary';
  confirmText?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  variant = 'danger',
  confirmText = 'Confirm',
}) => {
  if (!isOpen) {
    return null;
  }

  const confirmButtonClasses = variant === 'danger'
    ? 'bg-danger hover:bg-danger-light focus:ring-danger'
    : 'bg-primary hover:bg-primary-light focus:ring-primary';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-background-light-primary dark:bg-background-dark-secondary rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <h3 className="text-lg font-bold text-content-light-primary dark:text-content-dark-primary">{title}</h3>
        <p className="mt-2 text-sm text-content-light-secondary dark:text-content-dark-secondary">{message}</p>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmButtonClasses}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale { animation: fade-in-scale 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ConfirmationDialog;