import React, { useState } from 'react';
import { Customer, Transaction, TransactionType, CustomerWithBalance } from '../types';
import { formatDate } from '../utils/dateFormatter';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PlusIcon } from './icons/PlusIcon';
import PaginationControls from './PaginationControls';

const TRANSACTIONS_PER_PAGE = 5;

interface CustomerLedgerProps {
    customer: CustomerWithBalance;
    onBack: () => void;
    onAddTransaction: (customerId: string, transaction: Omit<Transaction, 'id' | 'date' | 'vendorId' | 'customerId'>) => void;
}

const CustomerLedger: React.FC<CustomerLedgerProps> = ({ customer, onBack, onAddTransaction }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleSubmit = (type: TransactionType) => {
        const numericAmount = parseFloat(amount);
        if (!numericAmount || numericAmount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }
        if (!description) {
            alert('Please enter a description.');
            return;
        }
        onAddTransaction(customer.id, { type, amount: numericAmount, description });
        setAmount('');
        setDescription('');
        setIsFormVisible(false);
        setCurrentPage(1); // Go to the first page to see the new transaction
    };

    const balanceColor = customer.balance > 0 ? 'text-danger' : 'text-success';
    const balanceText = customer.balance > 0 
        ? `${customer.balance.toFixed(2)} Due` 
        : customer.balance < 0
        ? `${Math.abs(customer.balance).toFixed(2)} Advance`
        : `0.00 Settled`;
        
    const totalPages = Math.ceil(customer.transactions.length / TRANSACTIONS_PER_PAGE);
    const paginatedTransactions = customer.transactions.slice(
        (currentPage - 1) * TRANSACTIONS_PER_PAGE,
        currentPage * TRANSACTIONS_PER_PAGE
    );

    return (
        <div className="w-full min-h-screen bg-background-light-secondary dark:bg-background-dark-primary p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between border-b dark:border-gray-700 pb-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="text-content-light-secondary dark:text-content-dark-secondary hover:text-content-light-primary dark:hover:text-content-dark-primary transition-colors">
                        <ArrowLeftIcon />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-content-light-primary dark:text-content-dark-primary">{customer.name}'s Ledger</h1>
                        <p className="text-sm text-content-light-secondary dark:text-content-dark-secondary">{customer.phoneNumber}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary">Current Balance</p>
                    <p className={`text-2xl font-bold ${balanceColor}`}>{balanceText}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                <div className="md:col-span-1">
                    {!isFormVisible ? (
                        <button onClick={() => setIsFormVisible(true)} className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            <PlusIcon />
                            <span>Add New Transaction</span>
                        </button>
                    ) : (
                        <div className="p-6 bg-background-light-primary dark:bg-background-dark-secondary rounded-lg border dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-content-light-primary dark:text-content-dark-primary mb-4">New Transaction</h2>
                            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                                <div>
                                    <label htmlFor="amount" className="text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary">Amount</label>
                                    <input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" required/>
                                </div>
                                <div>
                                    <label htmlFor="description" className="text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary">Description</label>
                                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., Milk, Bread, etc." rows={2} className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required/>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button type="button" onClick={() => handleSubmit(TransactionType.CREDIT)} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-danger hover:bg-danger-light">Credit</button>
                                    <button type="button" onClick={() => handleSubmit(TransactionType.PAYMENT)} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-success hover:bg-success-dark">Payment</button>
                                </div>
                                <button type="button" onClick={() => setIsFormVisible(false)} className="w-full text-sm text-center text-content-light-secondary dark:text-content-dark-secondary hover:underline">Cancel</button>
                            </form>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-background-light-primary dark:bg-background-dark-secondary rounded-lg border dark:border-gray-700 md:col-span-2 flex flex-col">
                    <h2 className="text-xl font-semibold text-content-light-primary dark:text-content-dark-primary mb-4">Transaction History</h2>
                    <div className="space-y-3 flex-grow min-h-[350px]">
                        {customer.transactions.length === 0 ? (
                            <p className="text-center text-content-light-secondary dark:text-content-dark-secondary pt-16">No transactions yet.</p>
                        ) : (
                            paginatedTransactions.map(t => (
                                <div key={t.id} className="p-3 bg-background-light-secondary dark:bg-background-dark-primary border dark:border-gray-700 rounded-md shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-grow">
                                            <p className="font-semibold text-content-light-primary dark:text-content-dark-primary">{t.description}</p>
                                            <p className="text-xs text-content-light-secondary dark:text-content-dark-secondary">{formatDate(t.date)}</p>
                                        </div>
                                        <div className={`font-bold text-right ${t.type === TransactionType.CREDIT ? 'text-danger' : 'text-success'}`}>
                                            {t.type === TransactionType.CREDIT ? '+' : '-'} {t.amount.toFixed(2)}
                                            <p className="text-xs font-normal opacity-80">{t.type}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                     {totalPages > 1 && (
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            </div>
          </div>
        </div>
    );
};

export default CustomerLedger;