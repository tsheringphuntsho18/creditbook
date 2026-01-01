
import React from 'react';
import { SortConfig, SortKey, SortDirection } from '../types';
import { SwitchVerticalIcon } from './icons/SwitchVerticalIcon';

interface SortControlsProps {
  sortConfig: SortConfig;
  onSortChange: (config: SortConfig) => void;
}

const sortOptions = [
  { label: 'Default', value: 'default-asc' },
  { label: 'Name (A-Z)', value: 'name-asc' },
  { label: 'Name (Z-A)', value: 'name-desc' },
  { label: 'Balance (High to Low)', value: 'balance-desc' },
  { label: 'Balance (Low to High)', value: 'balance-asc' },
];

const SortControls: React.FC<SortControlsProps> = ({ sortConfig, onSortChange }) => {
  const currentValue = `${sortConfig.key}-${sortConfig.direction}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [key, direction] = e.target.value.split('-') as [SortKey, SortDirection];
    onSortChange({ key, direction });
  };

  return (
    <div className="relative">
      <label htmlFor="sort-customers" className="sr-only">Sort Customers</label>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SwitchVerticalIcon />
      </div>
      <select
        id="sort-customers"
        value={currentValue}
        onChange={handleChange}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background-light-primary dark:bg-background-dark-secondary text-sm"
      >
        {sortOptions.map(option => (
          <option className="bg-white dark:bg-black" key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortControls;