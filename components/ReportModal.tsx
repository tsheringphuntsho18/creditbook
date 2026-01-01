import React, { useState, useMemo } from 'react';
import { CustomerWithBalance, TransactionType } from '../types';
import { XIcon } from './icons/XIcon';
import { DocumentReportIcon } from './icons/DocumentReportIcon';
import { formatDate } from '../utils/dateFormatter';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: CustomerWithBalance[];
  shopName: string;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, customers, shopName }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // We get YYYY-MM-DD, but we only care about year and month.
    // The Date constructor handles the timezone conversion correctly.
    if (e.target.value) {
        setSelectedDate(new Date(e.target.value));
    }
  };
  
  const reportData = useMemo(() => {
    return customers.map(customer => {
      const monthlyTxs = customer.transactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getFullYear() === year && txDate.getMonth() === month;
      });

      const totalCredit = monthlyTxs.reduce((sum, tx) => tx.type === TransactionType.CREDIT ? sum + tx.amount : sum, 0);
      const totalPayment = monthlyTxs.reduce((sum, tx) => tx.type === TransactionType.PAYMENT ? sum + tx.amount : sum, 0);

      return {
        ...customer,
        totalCredit,
        totalPayment,
        netChange: totalCredit - totalPayment,
      };
    }).filter(c => c.totalCredit > 0 || c.totalPayment > 0);
  }, [customers, year, month]);
  
  const grandTotals = useMemo(() => {
    return reportData.reduce((totals, customer) => {
        totals.credit += customer.totalCredit;
        totals.payment += customer.totalPayment;
        return totals;
    }, { credit: 0, payment: 0 });
  }, [reportData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-background-light-primary dark:bg-background-dark-secondary rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <header className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-center gap-2">
                <DocumentReportIcon />
                <h2 className="text-lg font-bold">Monthly Report</h2>
            </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XIcon /></button>
        </header>
        
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
                <label htmlFor="month-picker" className="font-medium">Select Month:</label>
                <input 
                    type="date" 
                    id="month-picker"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={handleDateChange}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:ring-primary focus:border-primary"
                />
            </div>
             <button onClick={() => window.print()} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-light">Download Report (PDF)</button>
        </div>
        
        <main id="report-content" className="p-6 overflow-y-auto">
            <div className="report-header text-center mb-6">
                <h1 className="text-2xl font-bold">{shopName}</h1>
                <p>Monthly Transaction Report</p>
                <p className="font-semibold">{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Total Credit</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Total Payment</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Net Change</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-background-dark-secondary divide-y divide-gray-200 dark:divide-gray-700">
                        {reportData.length === 0 ? (
                            <tr><td colSpan={4} className="text-center py-8">No transactions for this month.</td></tr>
                        ) : (
                            reportData.map(c => (
                                <tr key={c.id}>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="font-medium">{c.name}</div><div className="text-sm text-gray-500">{c.phoneNumber}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-danger font-mono">{c.totalCredit.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-success font-mono">{c.totalPayment.toFixed(2)}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-right font-mono font-semibold ${c.netChange > 0 ? 'text-danger' : 'text-success'}`}>{c.netChange.toFixed(2)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                     <tfoot className="bg-gray-50 dark:bg-gray-800 font-bold">
                        <tr>
                            <td className="px-6 py-3 text-left">Grand Totals</td>
                            <td className="px-6 py-3 text-right font-mono text-danger">{grandTotals.credit.toFixed(2)}</td>
                            <td className="px-6 py-3 text-right font-mono text-success">{grandTotals.payment.toFixed(2)}</td>
                            <td className="px-6 py-3"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </main>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale { animation: fade-in-scale 0.2s ease-out forwards; }
        @media print {
            body * { visibility: hidden; }
            #report-content, #report-content * { visibility: visible; }
            #report-content { 
                position: absolute; 
                left: 0; 
                top: 0; 
                width: 100%;
                color: black !important;
            }
            .dark #report-content * {
                color: black !important;
                background-color: white !important;
            }
            #report-content table {
                color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }
            #report-content thead {
                 background-color: #E5E7EB !important;
            }
             #report-content tfoot {
                 background-color: #E5E7EB !important;
            }
             #report-content .text-danger {
                color: #DC2626 !important;
            }
             #report-content .text-success {
                color: #059669 !important;
            }
        }
      `}</style>
    </div>
  );
};

export default ReportModal;