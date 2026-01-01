// FIX: Imported useState to resolve 'Cannot find name' errors.
import React, { useState, useRef, useEffect } from 'react';
import { Customer, SortConfig, CustomerWithBalance } from '../types';
import { UsersIcon } from './icons/UsersIcon';
import { PencilIcon } from './icons/PencilIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';
import PaginationControls from './PaginationControls';
import { SearchIcon } from './icons/SearchIcon';
import { LedgerIcon } from './icons/LedgerIcon';
import { BellIcon } from './icons/BellIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import SortControls from './SortControls';

interface CustomerEditFormProps {
    customer: Customer;
    onUpdate: (customer: Customer) => void;
    onCancel: () => void;
}

const CustomerEditForm: React.FC<CustomerEditFormProps> = ({ customer, onUpdate, onCancel }) => {
    const [name, setName] = useState(customer.name);
    const [phoneNumber, setPhoneNumber] = useState(customer.phoneNumber);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate({ ...customer, name, phoneNumber });
    };

    return (
        <form onSubmit={handleSave} className="p-3 bg-primary/10 border border-primary/20 rounded-md">
            <div className="space-y-2">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-2 py-1 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                    required
                />
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-2 py-1 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                    required
                />
            </div>
            <div className="flex items-center justify-end gap-2 mt-2">
                <button type="submit" className="p-1 text-green-600 hover:text-green-800">
                    <CheckIcon />
                </button>
                <button type="button" onClick={onCancel} className="p-1 text-red-600 hover:text-red-800">
                    <XIcon />
                </button>
            </div>
        </form>
    );
};

interface BulkActionsBarProps {
    selectedCount: number;
    onDeselectAll: () => void;
    onBulkDelete: () => void;
    onBulkReminder: () => void;
    hasDueBalance: boolean;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({ selectedCount, onDeselectAll, onBulkDelete, onBulkReminder, hasDueBalance }) => (
    <div className="bg-primary text-white p-3 rounded-md flex justify-between items-center mb-4 shadow-lg">
        <span className="font-semibold">{selectedCount} selected</span>
        <div className="flex items-center gap-2">
            <button 
                onClick={onBulkReminder} 
                disabled={!hasDueBalance}
                className="flex items-center gap-1.5 text-sm px-3 py-1 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={!hasDueBalance ? 'No selected customer has a due balance' : 'Send reminders'}
            >
                <BellIcon /> <span>Send Reminders</span>
            </button>
            <button onClick={onBulkDelete} className="flex items-center gap-1.5 text-sm px-3 py-1 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors">
                <TrashIcon /> <span>Delete</span>
            </button>
            <button onClick={onDeselectAll} className="p-1.5 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors" title="Deselect all">
                <XCircleIcon />
            </button>
        </div>
    </div>
);


interface CustomerListProps {
  customers: CustomerWithBalance[];
  editingCustomerId: string | null;
  onEdit: (id: string) => void;
  onCancel: () => void;
  onUpdate: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onViewLedger: (id: string) => void;
  onSendReminder: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortConfig: SortConfig;
  onSortChange: (config: SortConfig) => void;
  totalCustomers: number;
  selectedCustomerIds: string[];
  setSelectedCustomerIds: React.Dispatch<React.SetStateAction<string[]>>;
  onBulkDelete: () => void;
  onBulkReminder: () => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ 
  customers, 
  editingCustomerId, 
  onEdit, 
  onCancel, 
  onUpdate, 
  onDelete,
  onViewLedger,
  onSendReminder,
  currentPage,
  totalPages,
  onPageChange,
  searchQuery,
  onSearchChange,
  sortConfig,
  onSortChange,
  totalCustomers,
  selectedCustomerIds,
  setSelectedCustomerIds,
  onBulkDelete,
  onBulkReminder
}) => {
  const hasCustomers = totalCustomers > 0 || searchQuery;
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  const numVisibleSelected = customers.filter(c => selectedCustomerIds.includes(c.id)).length;
  const isAllVisibleSelected = numVisibleSelected === customers.length && customers.length > 0;
  const isSomeVisibleSelected = numVisibleSelected > 0 && !isAllVisibleSelected;

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = isSomeVisibleSelected;
    }
  }, [isSomeVisibleSelected]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allVisibleIds = customers.map(c => c.id);
      setSelectedCustomerIds(Array.from(new Set([...selectedCustomerIds, ...allVisibleIds])));
    } else {
      const visibleIdsSet = new Set(customers.map(c => c.id));
      setSelectedCustomerIds(selectedCustomerIds.filter(id => !visibleIdsSet.has(id)));
    }
  };

  const handleSelectCustomer = (customerId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCustomerIds([...selectedCustomerIds, customerId]);
    } else {
      setSelectedCustomerIds(selectedCustomerIds.filter(id => id !== customerId));
    }
  };

  const hasDueBalanceInSelection = customers.some(c => selectedCustomerIds.includes(c.id) && c.balance > 0);

  return (
    <div className="bg-background-light-primary dark:bg-background-dark-secondary rounded-lg flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-content-light-primary dark:text-content-dark-primary flex items-center gap-2">
          <UsersIcon />
          <span>Your Customers</span>
        </h2>
        {hasCustomers && <span className="text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">{totalCustomers} found</span>}
      </div>

      {hasCustomers && (
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <SortControls sortConfig={sortConfig} onSortChange={onSortChange} />
        </div>
      )}

      {selectedCustomerIds.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedCustomerIds.length}
          onDeselectAll={() => setSelectedCustomerIds([])}
          onBulkDelete={onBulkDelete}
          onBulkReminder={onBulkReminder}
          hasDueBalance={hasDueBalanceInSelection}
        />
      )}

      <div className="space-y-3 min-h-[280px] flex-grow">
        {customers.length === 0 ? (
          <p className="text-center text-content-light-secondary dark:text-content-dark-secondary pt-16">{searchQuery ? 'No customers match your search.' : 'No customers added yet.'}</p>
        ) : (
          <>
            <div className="flex items-center px-3 py-2">
                <input
                    type="checkbox"
                    ref={selectAllCheckboxRef}
                    checked={isAllVisibleSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-primary border-gray-300 dark:border-gray-600 rounded focus:ring-primary"
                    aria-label="Select all customers on this page"
                />
                <label htmlFor="select-all" className="ml-3 text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary">Select All</label>
            </div>
            {customers.map((customer, index) => (
              <div key={customer.id}>
                {editingCustomerId === customer.id ? (
                  <CustomerEditForm 
                      customer={customer}
                      onUpdate={onUpdate}
                      onCancel={onCancel}
                  />
                ) : (
                  <div 
                    onClick={() => onViewLedger(customer.id)}
                    className={`border border-gray-200 dark:border-gray-700 rounded-lg flex items-center gap-4 transition-all duration-200 ease-in-out shadow-sm cursor-pointer hover:shadow-lg hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${index % 2 === 0 ? 'bg-background-light-primary dark:bg-background-dark-secondary' : 'bg-background-light-secondary dark:bg-background-dark-primary/60'}`}
                  >
                    <div className="pl-4">
                        <input
                        type="checkbox"
                        checked={selectedCustomerIds.includes(customer.id)}
                        onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)}
                        className="h-4 w-4 text-primary border-gray-300 dark:border-gray-600 rounded focus:ring-primary"
                        aria-labelledby={`customer-name-${customer.id}`}
                        onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="flex-grow p-4">
                        <p id={`customer-name-${customer.id}`} className="font-semibold text-content-light-primary dark:text-content-dark-primary">{customer.name}</p>
                        <p className="text-sm text-content-light-secondary dark:text-content-dark-secondary">{customer.phoneNumber}</p>
                        {customer.balance !== 0 && (
                            <p className={`text-xs font-bold mt-1 ${customer.balance > 0 ? 'text-danger' : 'text-success'}`}>
                                {customer.balance > 0 ? `Due: ${customer.balance.toFixed(2)}` : `Advance: ${Math.abs(customer.balance).toFixed(2)}`}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center pr-2">
                      {customer.balance > 0 && (
                        <button onClick={(e) => { e.stopPropagation(); onSendReminder(customer.id); }} className="p-2 text-content-light-secondary dark:text-content-dark-secondary hover:text-yellow-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Send Reminder">
                            <BellIcon />
                        </button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); onEdit(customer.id); }} className="p-2 text-content-light-secondary dark:text-content-dark-secondary hover:text-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Edit Customer">
                        <PencilIcon />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); onDelete(customer.id); }} className="p-2 text-content-light-secondary dark:text-content-dark-secondary hover:text-danger rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Delete Customer">
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
      {hasCustomers && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default CustomerList;