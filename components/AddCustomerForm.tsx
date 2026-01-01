import React, { useState } from 'react';
import { Customer } from '../types';
import { UserIcon } from './icons/UserIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { PlusIcon } from './icons/PlusIcon';

interface AddCustomerFormProps {
  onAddCustomer: (customer: Omit<Customer, 'id'>) => void;
  onCancel: () => void;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ onAddCustomer, onCancel }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 8) {
        setPhoneError('Phone number must be exactly 8 digits.');
        return;
    }
    if (name && phoneNumber) {
      onAddCustomer({ name, phoneNumber });
      setName('');
      setPhoneNumber('');
      setPhoneError('');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    if (phoneError) {
        setPhoneError('');
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customer-name" className="text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary">
            Customer Name
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon />
            </div>
            <input
              id="customer-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="appearance-none block w-full px-3 py-2 pl-10 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="e.g., Jane Smith"
            />
          </div>
        </div>

        <div>
          <label htmlFor="customer-phone" className="text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary">
            Phone Number
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PhoneIcon />
            </div>
            <input
              id="customer-phone"
              type="tel"
              required
              value={phoneNumber}
              onChange={handlePhoneChange}
              className={`appearance-none block w-full px-3 py-2 pl-10 bg-transparent border rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none sm:text-sm ${phoneError ? 'border-danger focus:ring-danger focus:border-danger' : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary'}`}
              placeholder="8-digit mobile number"
            />
          </div>
          {phoneError && <p className="mt-2 text-sm text-danger">{phoneError}</p>}
        </div>

        <div className="flex gap-2 pt-2">
            <button
                type="button"
                onClick={onCancel}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-content-light-primary dark:text-content-dark-primary bg-background-light-primary dark:bg-background-dark-secondary hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
            >
             Cancel
            </button>
            <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
                <PlusIcon />
                <span>Add Customer</span>
            </button>
        </div>
      </form>
  );
};

export default AddCustomerForm;