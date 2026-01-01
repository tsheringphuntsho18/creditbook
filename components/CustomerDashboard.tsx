
import React, { useMemo, useState } from 'react';
import { Customer, ShopStatus, TransactionType, Theme, VendorRegistrationData, Transaction, Notification } from '../types';
import { formatDate } from '../utils/dateFormatter';
import { LogoutIcon } from './icons/LogoutIcon';
import { ShopIcon } from './icons/ShopIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import PaginationControls from './PaginationControls';
import NotificationBell from './NotificationBell';

const TRANSACTIONS_PER_PAGE = 10;

interface CustomerDashboardProps {
    customer: Customer;
    onLogout: () => void;
    vendors: VendorRegistrationData[];
    transactions: Transaction[];
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    theme: Theme;
    toggleTheme: () => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ customer, onLogout, vendors, transactions, notifications, setNotifications, theme, toggleTheme }) => {
    const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const shopsData = useMemo(() => {
        const customerTxs = transactions.filter(tx => tx.customerId === customer.phoneNumber);
        // FIX: Cast the initial value for `reduce` to the correct type, `Record<string, Transaction[]>`, and remove the explicit generic. This resolves the type inference error.
        const txsByVendor = customerTxs.reduce((acc, tx) => {
            if (!acc[tx.vendorId]) acc[tx.vendorId] = [];
            acc[tx.vendorId].push(tx);
            return acc;
        }, {} as Record<string, Transaction[]>);

        return Object.keys(txsByVendor).map(vendorId => {
            const vendor = vendors.find(v => v.phoneNumber === vendorId);
            if (!vendor) return null;

            const vendorTxs = txsByVendor[vendorId].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const balance = vendorTxs.reduce((acc, t) => acc + (t.type === TransactionType.CREDIT ? t.amount : -t.amount), 0);
            
            return { vendor, balance, transactions: vendorTxs };
        }).filter((data): data is { vendor: VendorRegistrationData; balance: number; transactions: Transaction[] } => data !== null);
    }, [transactions, vendors, customer.phoneNumber]);

    const selectedShopData = selectedVendorId ? shopsData.find(d => d.vendor.phoneNumber === selectedVendorId) : null;

    if (selectedShopData) {
        const { vendor, balance, transactions: shopTransactions } = selectedShopData;
        const balanceColor = balance > 0 ? 'text-danger' : 'text-success';
        const balanceText = balance > 0 ? `${balance.toFixed(2)} Due` : balance < 0 ? `${Math.abs(balance).toFixed(2)} Advance` : `0.00 Settled`;
        const isShopOpen = vendor.shopStatus === ShopStatus.OPEN;

        const totalPages = Math.ceil(shopTransactions.length / TRANSACTIONS_PER_PAGE);
        const paginatedTransactions = shopTransactions.slice((currentPage - 1) * TRANSACTIONS_PER_PAGE, currentPage * TRANSACTIONS_PER_PAGE);

        return (
            <div className="w-full min-h-screen bg-background-light-secondary dark:bg-background-dark-primary">
                 <header className="bg-background-light-primary dark:bg-background-dark-secondary shadow-md sticky top-0 z-40">
                     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="flex justify-between items-center py-4">
                             <div className="flex items-center gap-4">
                                <button onClick={() => { setSelectedVendorId(null); setCurrentPage(1); }} className="text-content-light-secondary dark:text-content-dark-secondary hover:text-content-light-primary dark:hover:text-content-dark-primary">
                                    <ArrowLeftIcon />
                                </button>
                                {vendor.shopLogo ? (
                                    <img src={vendor.shopLogo} alt={`${vendor.shopName} logo`} className="h-12 w-12 rounded-full object-cover" />
                                ) : (
                                     <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400"><ShopIcon /></div>
                                )}
                                <div>
                                    <h1 className="text-xl font-bold">{vendor.shopName}</h1>
                                    <p className="text-sm text-content-light-secondary dark:text-content-dark-secondary">Your Ledger</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary">Balance</p>
                                <p className={`text-2xl font-bold ${balanceColor}`}>{balanceText}</p>
                            </div>
                         </div>
                     </div>
                 </header>
                 <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-background-light-primary dark:bg-background-dark-secondary rounded-lg shadow-md">
                        <span className="font-semibold">Shop Status:</span>
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${isShopOpen ? 'bg-success animate-pulse' : 'bg-danger'}`}></div>
                            <span className={`font-bold ${isShopOpen ? 'text-success' : 'text-danger'}`}>{isShopOpen ? 'Open' : 'Closed'}</span>
                        </div>
                    </div>
                     <div className="bg-background-light-primary dark:bg-background-dark-secondary p-6 rounded-xl shadow-lg space-y-4">
                         <h2 className="text-xl font-semibold">Transaction History</h2>
                         <div className="space-y-3">
                             {paginatedTransactions.length === 0 ? (
                                 <p className="text-center text-content-light-secondary dark:text-content-dark-secondary py-10">No transactions with this shop.</p>
                             ) : (
                                paginatedTransactions.map(t => (
                                     <div key={t.id} className="p-4 bg-background-light-secondary dark:bg-background-dark-primary border-b border-gray-200 dark:border-gray-700">
                                         <div className="flex justify-between items-start">
                                             <div>
                                                 <p className="font-semibold">{t.description}</p>
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
                         {totalPages > 1 && <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
                     </div>
                 </main>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen bg-background-light-secondary dark:bg-background-dark-primary">
            <header className="bg-background-light-primary dark:bg-background-dark-secondary shadow-md sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-xl font-bold text-content-light-primary dark:text-content-dark-primary">Welcome, {customer.name}!</h1>
                            <p className="text-sm text-content-light-secondary dark:text-content-dark-secondary">Select a shop to view your ledger.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <NotificationBell customer={customer} notifications={notifications} setNotifications={setNotifications} />
                            <button onClick={toggleTheme} className="p-2 rounded-full text-content-light-secondary dark:text-content-dark-secondary hover:bg-gray-200 dark:hover:bg-gray-700">
                                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                            </button>
                             <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-danger rounded-lg hover:bg-danger-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger">
                                <LogoutIcon />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-4">
                {shopsData.length === 0 ? (
                    <div className="text-center p-10 bg-background-light-primary dark:bg-background-dark-secondary rounded-lg shadow-md">
                        <p className="text-content-light-secondary dark:text-content-dark-secondary">You don't have a credit history with any shop yet.</p>
                    </div>
                ) : (
                    shopsData.map(({ vendor, balance }) => {
                        const balanceColor = balance > 0 ? 'text-danger' : 'text-success';
                        const balanceText = balance > 0 ? `${balance.toFixed(2)} Due` : balance < 0 ? `${Math.abs(balance).toFixed(2)} Advance` : `Settled`;
                        return (
                            <button key={vendor.phoneNumber} onClick={() => setSelectedVendorId(vendor.phoneNumber)} className="w-full text-left p-4 bg-background-light-primary dark:bg-background-dark-secondary rounded-lg shadow-md hover:shadow-lg hover:border-primary border border-transparent transition-all flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                     {vendor.shopLogo ? (
                                        <img src={vendor.shopLogo} alt={`${vendor.shopName} logo`} className="h-12 w-12 rounded-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400"><ShopIcon /></div>
                                    )}
                                    <div className="flex-grow">
                                        <p className="font-bold text-lg">{vendor.shopName}</p>
                                        <p className="text-sm text-content-light-secondary dark:text-content-dark-secondary">{vendor.shopLocation}</p>
                                        {vendor.shopDescription && (
                                            <p className="text-xs italic text-content-light-secondary dark:text-content-dark-secondary mt-1 truncate">{vendor.shopDescription}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary">Your Balance</p>
                                    <p className={`font-bold ${balanceColor}`}>{balanceText}</p>
                                </div>
                            </button>
                        )
                    })
                )}
            </main>
        </div>
    );
};

export default CustomerDashboard;