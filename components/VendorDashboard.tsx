import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Customer,
  VendorRegistrationData,
  ShopStatus,
  Transaction,
  TransactionType,
  SortConfig,
  Theme,
  CustomerWithBalance,
  Notification,
  NotificationType,
} from "../types";
import AddCustomerForm from "./AddCustomerForm";
import CustomerList from "./CustomerList";
import ConfirmationDialog from "./ConfirmationDialog";
import { LogoutIcon } from "./icons/LogoutIcon";
import ShopDetails from "./ShopDetails";
import CustomerLedger from "./CustomerLedger";
import { SunIcon } from "./icons/SunIcon";
import { MoonIcon } from "./icons/MoonIcon";
// ...existing code...
import { ShopIcon } from "./icons/ShopIcon";
import { PlusIcon } from "./icons/PlusIcon";
import { XIcon } from "./icons/XIcon";

const ITEMS_PER_PAGE = 5;

interface VendorDashboardProps {
  onLogout: () => void;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  vendorCustomerLinks: { vendorId: string; customerId: string }[];
  setVendorCustomerLinks: React.Dispatch<
    React.SetStateAction<{ vendorId: string; customerId: string }[]>
  >;
  shopDetails: VendorRegistrationData;
  onUpdateShopDetails: (details: VendorRegistrationData) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const VendorDashboard: React.FC<VendorDashboardProps> = ({
  onLogout,
  customers,
  setCustomers,
  transactions,
  setTransactions,
  notifications,
  setNotifications,
  vendorCustomerLinks,
  setVendorCustomerLinks,
  shopDetails,
  onUpdateShopDetails,
  theme,
  toggleTheme,
}) => {
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(
    null
  );
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "default",
    direction: "asc",
  });
  const [viewingCustomerId, setViewingCustomerId] = useState<string | null>(
    null
  );
  const [remindingCustomerId, setRemindingCustomerId] = useState<string | null>(
    null
  );
  const [showReminderSuccess, setShowReminderSuccess] = useState(false);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isBulkReminding, setIsBulkReminding] = useState(false);
  // ...existing code...
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const shopMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shopMenuRef.current &&
        !shopMenuRef.current.contains(event.target as Node)
      ) {
        setIsShopMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [shopMenuRef]);

  const vendorCustomers = useMemo((): CustomerWithBalance[] => {
    const vendorTxs = transactions.filter(
      (tx) => tx.vendorId === shopDetails.phoneNumber
    );

    const customerIdsFromTxs = new Set(vendorTxs.map((tx) => tx.customerId));
    const customerIdsFromLinks = new Set(
      vendorCustomerLinks
        .filter((link) => link.vendorId === shopDetails.phoneNumber)
        .map((link) => link.customerId)
    );
    const allCustomerPhoneNumbers = [
      ...new Set([...customerIdsFromTxs, ...customerIdsFromLinks]),
    ];

    return allCustomerPhoneNumbers
      .map((phoneNumber) => {
        const customerProfile = customers.find(
          (c) => c.phoneNumber === phoneNumber
        );
        if (!customerProfile) return null;

        const customerTxs = vendorTxs
          .filter((tx) => tx.customerId === phoneNumber)
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        const balance = customerTxs.reduce(
          (acc, t) =>
            acc + (t.type === TransactionType.CREDIT ? t.amount : -t.amount),
          0
        );

        return {
          ...customerProfile,
          balance,
          transactions: customerTxs,
        };
      })
      .filter((c): c is CustomerWithBalance => c !== null);
  }, [transactions, customers, vendorCustomerLinks, shopDetails.phoneNumber]);

  const totalBalanceDue = useMemo(
    () =>
      vendorCustomers.reduce(
        (acc, curr) => acc + (curr.balance > 0 ? curr.balance : 0),
        0
      ),
    [vendorCustomers]
  );

  const addNotification = (
    notification: Omit<Notification, "id" | "date" | "read">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: new Date().toISOString() + Math.random(),
      date: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const handleUpdateShopDetails = (updatedDetails: VendorRegistrationData) => {
    onUpdateShopDetails(updatedDetails);
  };

  const handleStatusChange = (newStatus: ShopStatus) => {
    onUpdateShopDetails({ ...shopDetails, shopStatus: newStatus });
  };

  const handleAddCustomer = (customer: Omit<Customer, "id">) => {
    let existingCustomer = customers.find(
      (c) => c.phoneNumber === customer.phoneNumber
    );
    let newCustomerGlobally = false;

    if (!existingCustomer) {
      const newCustomer: Customer = {
        ...customer,
        id: new Date().toISOString(),
      };
      setCustomers((prev) => [...prev, newCustomer]);
      existingCustomer = newCustomer;
      newCustomerGlobally = true;
    }

    const linkExists = vendorCustomerLinks.some(
      (link) =>
        link.vendorId === shopDetails.phoneNumber &&
        link.customerId === existingCustomer!.phoneNumber
    );

    if (!linkExists) {
      setVendorCustomerLinks((prev) => [
        ...prev,
        {
          vendorId: shopDetails.phoneNumber,
          customerId: existingCustomer!.phoneNumber,
        },
      ]);
    }

    if (newCustomerGlobally) {
      addNotification({
        customerId: existingCustomer!.phoneNumber,
        vendorId: shopDetails.phoneNumber,
        vendorShopName: shopDetails.shopName,
        type: NotificationType.NEW_CUSTOMER,
        message: `Welcome! You've been added to ${shopDetails.shopName}'s credit book.`,
      });
    }
    setIsAddCustomerModalOpen(false);
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === updatedCustomer.id
          ? {
              ...customer,
              name: updatedCustomer.name,
              phoneNumber: updatedCustomer.phoneNumber,
            }
          : customer
      )
    );
    setEditingCustomerId(null);
  };

  const handleInitiateDelete = (id: string) => setDeletingCustomerId(id);

  const handleConfirmDelete = () => {
    if (deletingCustomerId) {
      const customerToDelete = customers.find(
        (c) => c.id === deletingCustomerId
      );
      if (customerToDelete) {
        setTransactions((prevTxs) =>
          prevTxs.filter(
            (tx) =>
              !(
                tx.customerId === customerToDelete.phoneNumber &&
                tx.vendorId === shopDetails.phoneNumber
              )
          )
        );
        setVendorCustomerLinks((prevLinks) =>
          prevLinks.filter(
            (link) =>
              !(
                link.customerId === customerToDelete.phoneNumber &&
                link.vendorId === shopDetails.phoneNumber
              )
          )
        );
      }
      setDeletingCustomerId(null);
    }
  };

  const handleInitiateBulkDelete = () => {
    if (selectedCustomerIds.length > 0) setIsBulkDeleting(true);
  };

  const handleConfirmBulkDelete = () => {
    const selectedCustomers = customers.filter((c) =>
      selectedCustomerIds.includes(c.id)
    );
    const selectedPhoneNumbers = new Set(
      selectedCustomers.map((c) => c.phoneNumber)
    );

    setTransactions((prevTxs) =>
      prevTxs.filter(
        (tx) =>
          !(
            tx.vendorId === shopDetails.phoneNumber &&
            selectedPhoneNumbers.has(tx.customerId)
          )
      )
    );

    setVendorCustomerLinks((prevLinks) =>
      prevLinks.filter(
        (link) =>
          !(
            link.vendorId === shopDetails.phoneNumber &&
            selectedPhoneNumbers.has(link.customerId)
          )
      )
    );

    setSelectedCustomerIds([]);
    setIsBulkDeleting(false);
  };

  const handleInitiateBulkReminder = () => {
    if (
      selectedCustomerIds.some(
        (id) => vendorCustomers.find((c) => c.id === id)?.balance > 0
      )
    ) {
      setIsBulkReminding(true);
    }
  };

  const handleConfirmBulkReminder = () => {
    selectedCustomerIds.forEach((id) => {
      const customer = vendorCustomers.find((c) => c.id === id);
      if (customer && customer.balance > 0) {
        addNotification({
          customerId: customer.phoneNumber,
          vendorId: shopDetails.phoneNumber,
          vendorShopName: shopDetails.shopName,
          type: NotificationType.REMINDER,
          message: `A friendly reminder that your due balance is ${customer.balance.toFixed(
            2
          )}.`,
        });
      }
    });
    setShowReminderSuccess(true);
    setTimeout(() => setShowReminderSuccess(false), 4000);
    setSelectedCustomerIds([]);
    setIsBulkReminding(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setEditingCustomerId(null);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setSelectedCustomerIds([]);
  };

  const handleViewLedger = (customerId: string) =>
    setViewingCustomerId(customerId);
  const handleInitiateReminder = (id: string) => setRemindingCustomerId(id);
  const handleCancelReminder = () => setRemindingCustomerId(null);

  const handleConfirmReminder = () => {
    if (remindingCustomerId) {
      const customer = vendorCustomers.find(
        (c) => c.id === remindingCustomerId
      );
      if (customer) {
        addNotification({
          customerId: customer.phoneNumber,
          vendorId: shopDetails.phoneNumber,
          vendorShopName: shopDetails.shopName,
          type: NotificationType.REMINDER,
          message: `A friendly reminder that your due balance is ${customer.balance.toFixed(
            2
          )}.`,
        });
        setShowReminderSuccess(true);
        setTimeout(() => setShowReminderSuccess(false), 4000);
      }
      setRemindingCustomerId(null);
    }
  };

  const handleAddTransaction = (
    customerId: string,
    transaction: Omit<Transaction, "id" | "date" | "vendorId" | "customerId">
  ) => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;

    const newTransaction: Transaction = {
      ...transaction,
      id: new Date().toISOString(),
      date: new Date().toISOString(),
      vendorId: shopDetails.phoneNumber,
      customerId: customer.phoneNumber,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    addNotification({
      customerId: customer.phoneNumber,
      vendorId: shopDetails.phoneNumber,
      vendorShopName: shopDetails.shopName,
      type:
        transaction.type === TransactionType.CREDIT
          ? NotificationType.CREDIT
          : NotificationType.PAYMENT,
      message: `${transaction.amount.toFixed(2)} was ${
        transaction.type === TransactionType.CREDIT ? "credited to" : "paid on"
      } your account for "${transaction.description}".`,
    });
  };

  const customerToDelete = vendorCustomers.find(
    (c) => c.id === deletingCustomerId
  );
  const customerToRemind = vendorCustomers.find(
    (c) => c.id === remindingCustomerId
  );
  const customerToView = vendorCustomers.find(
    (c) => c.id === viewingCustomerId
  );

  const filteredCustomers = useMemo(
    () =>
      vendorCustomers.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.phoneNumber.includes(searchQuery)
      ),
    [vendorCustomers, searchQuery]
  );
  const sortedCustomers = useMemo(() => {
    let sortableItems = [...filteredCustomers];
    if (sortConfig.key !== "default") {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === "name")
          return sortConfig.direction === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        if (sortConfig.key === "balance")
          return sortConfig.direction === "asc"
            ? a.balance - b.balance
            : b.balance - a.balance;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredCustomers, sortConfig]);

  const totalPages = Math.ceil(sortedCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = sortedCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (customerToView) {
    return (
      <CustomerLedger
        customer={customerToView}
        onBack={() => setViewingCustomerId(null)}
        onAddTransaction={handleAddTransaction}
      />
    );
  }

  return (
    <>
      <div className="w-full min-h-screen bg-background-light-secondary dark:bg-background-dark-primary">
        {showReminderSuccess && (
          <div
            className="fixed top-5 right-5 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md shadow-lg z-50"
            role="alert"
          >
            <p className="font-bold">Reminder(s) Sent!</p>
          </div>
        )}
        <header className="bg-background-light-primary dark:bg-background-dark-secondary shadow-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-4">
                <div ref={shopMenuRef} className="relative">
                  <button
                    onClick={() => setIsShopMenuOpen((prev) => !prev)}
                    className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary ring-offset-2 dark:ring-offset-background-dark-secondary transition-all"
                  >
                    {shopDetails.shopLogo ? (
                      <img
                        src={shopDetails.shopLogo}
                        alt={`${shopDetails.shopName} logo`}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <ShopIcon />
                    )}
                  </button>
                  {isShopMenuOpen && (
                    <div className="absolute top-14 left-0 w-80 bg-background-light-primary dark:bg-background-dark-secondary rounded-xl shadow-2xl border dark:border-gray-700 z-50 p-2">
                      <ShopDetails
                        shopDetails={shopDetails}
                        onUpdate={handleUpdateShopDetails}
                        onStatusChange={handleStatusChange}
                      />
                      <button
                        onClick={onLogout}
                        className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-danger rounded-lg hover:bg-danger-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger"
                      >
                        <LogoutIcon />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-content-light-secondary dark:text-content-dark-secondary">
                    Welcome back, {shopDetails.fullName.split(" ")[0]}
                  </p>
                  <h1 className="text-2xl font-bold text-content-light-primary dark:text-content-dark-primary">
                    {shopDetails.shopName}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-content-light-secondary dark:text-content-dark-secondary hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {theme === "light" ? <MoonIcon /> : <SunIcon />}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background-light-primary dark:bg-background-dark-secondary p-6 rounded-xl shadow-lg">
              <h3 className="text-content-light-secondary dark:text-content-dark-secondary font-medium">
                Total Balance Due
              </h3>
              <p className="text-4xl font-bold text-danger mt-2">
                {totalBalanceDue.toFixed(2)}
              </p>
            </div>
            <div className="bg-background-light-primary dark:bg-background-dark-secondary p-6 rounded-xl shadow-lg">
              <h3 className="text-content-light-secondary dark:text-content-dark-secondary font-medium">
                Active Customers
              </h3>
              <p className="text-4xl font-bold text-primary mt-2">
                {vendorCustomers.length}
              </p>
            </div>
          </section>

          {/* ...existing code... */}

          <div className="bg-background-light-primary dark:bg-background-dark-secondary p-6 rounded-xl shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-content-light-primary dark:text-content-dark-primary">
                Customer Management
              </h2>
              <button
                onClick={() => setIsAddCustomerModalOpen(true)}
                className="flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <PlusIcon />
                <span>Add New Customer</span>
              </button>
            </div>
            <div>
              <CustomerList
                customers={paginatedCustomers}
                editingCustomerId={editingCustomerId}
                onEdit={setEditingCustomerId}
                onCancel={() => setEditingCustomerId(null)}
                onUpdate={handleUpdateCustomer}
                onDelete={handleInitiateDelete}
                onViewLedger={handleViewLedger}
                onSendReminder={handleInitiateReminder}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                sortConfig={sortConfig}
                onSortChange={setSortConfig}
                totalCustomers={sortedCustomers.length}
                selectedCustomerIds={selectedCustomerIds}
                setSelectedCustomerIds={setSelectedCustomerIds}
                onBulkDelete={handleInitiateBulkDelete}
                onBulkReminder={handleInitiateBulkReminder}
              />
            </div>
          </div>
        </main>
      </div>

      {isAddCustomerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-background-light-primary dark:bg-background-dark-secondary rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
            <header className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-bold">Add a New Customer</h2>
              <button
                onClick={() => setIsAddCustomerModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <XIcon />
              </button>
            </header>
            <div className="p-6">
              <AddCustomerForm
                onAddCustomer={handleAddCustomer}
                onCancel={() => setIsAddCustomerModalOpen(false)}
              />
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
      )}

      <ConfirmationDialog
        isOpen={!!deletingCustomerId}
        onClose={() => setDeletingCustomerId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete all transactions for ${
          customerToDelete?.name ?? "this customer"
        }? This action is permanent.`}
        variant="danger"
        confirmText="Confirm Delete"
      />
      <ConfirmationDialog
        isOpen={!!remindingCustomerId}
        onClose={handleCancelReminder}
        onConfirm={handleConfirmReminder}
        title="Send Payment Reminder"
        message={`Send an SMS reminder to ${
          customerToRemind?.name ?? "this customer"
        } for the due amount of ${
          customerToRemind?.balance.toFixed(2) ?? "0.00"
        }?`}
        variant="primary"
        confirmText="Send Reminder"
      />
      <ConfirmationDialog
        isOpen={isBulkDeleting}
        onClose={() => setIsBulkDeleting(false)}
        onConfirm={handleConfirmBulkDelete}
        title={`Delete ${selectedCustomerIds.length} Customers`}
        message={`Are you sure you want to permanently delete all transactions for the ${selectedCustomerIds.length} selected customers?`}
        variant="danger"
        confirmText="Delete All"
      />
      <ConfirmationDialog
        isOpen={isBulkReminding}
        onClose={() => setIsBulkReminding(false)}
        onConfirm={handleConfirmBulkReminder}
        title={`Send ${
          selectedCustomerIds.filter(
            (id) => vendorCustomers.find((c) => c.id === id)?.balance > 0
          ).length
        } Reminders`}
        message={`This will send SMS reminders to all selected customers with a due balance. Continue?`}
        variant="primary"
        confirmText="Send to All"
      />
      {/* ...existing code... */}
    </>
  );
};

export default VendorDashboard;
