import React, { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import VendorLogin from './components/VendorLogin';
import CustomerLogin from './components/CustomerLogin';
import VendorRegistration from './components/VendorRegistration';
import VendorDashboard from './components/VendorDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import SplashScreen from './components/SplashScreen';
import { View, Customer, VendorRegistrationData, ShopType, ShopStatus, Theme, Transaction, Notification } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>(View.WELCOME);
  const [showSuccess, setShowSuccess] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
      }
    }
    return 'light';
  });
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vendors, setVendors] = useState<VendorRegistrationData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [vendorCustomerLinks, setVendorCustomerLinks] = useState<{vendorId: string, customerId: string}[]>([]);
  const [loggedInCustomer, setLoggedInCustomer] = useState<Customer | null>(null);
  const [loggedInVendor, setLoggedInVendor] = useState<VendorRegistrationData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);


  const handleRegistrationSuccess = (data: VendorRegistrationData) => {
    setVendors(prev => [...prev, data]);
    setShowSuccess(true);
    setCurrentView(View.VENDOR_LOGIN);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleVendorLoginSuccess = (phoneNumber: string) => {
    const vendor = vendors.find(v => v.phoneNumber === phoneNumber);
    if (vendor) {
      setLoggedInVendor(vendor);
      setCurrentView(View.VENDOR_DASHBOARD);
    } else {
      console.error("Could not find vendor data after login.");
    }
  };

  const handleCustomerLoginSuccess = (customer: Customer) => {
    setLoggedInCustomer(customer);
    setCurrentView(View.CUSTOMER_DASHBOARD);
  };

  const handleLogout = () => {
    setLoggedInCustomer(null);
    setLoggedInVendor(null);
    setCurrentView(View.WELCOME);
  };

  const handleShopDetailsUpdate = (updatedDetails: VendorRegistrationData) => {
    setLoggedInVendor(updatedDetails);
    setVendors(prevVendors => prevVendors.map(v => v.phoneNumber === updatedDetails.phoneNumber ? updatedDetails : v));
  };

  const isAuthView = [View.WELCOME, View.VENDOR_LOGIN, View.CUSTOMER_LOGIN, View.VENDOR_REGISTRATION].includes(currentView);

  const renderView = () => {
    switch (currentView) {
      case View.VENDOR_LOGIN:
        return <VendorLogin onBack={() => setCurrentView(View.WELCOME)} showSuccessMessage={showSuccess} onLoginSuccess={handleVendorLoginSuccess} vendors={vendors} />;
      case View.CUSTOMER_LOGIN:
        // Pass all customers for login validation
        return <CustomerLogin onBack={() => setCurrentView(View.WELCOME)} onLoginSuccess={handleCustomerLoginSuccess} customers={customers} />;
      case View.VENDOR_REGISTRATION:
        return <VendorRegistration onBack={() => setCurrentView(View.WELCOME)} onRegistrationSuccess={handleRegistrationSuccess} />;
      case View.VENDOR_DASHBOARD:
        if (loggedInVendor) {
          return <VendorDashboard 
            onLogout={handleLogout} 
            customers={customers} 
            setCustomers={setCustomers}
            transactions={transactions}
            setTransactions={setTransactions}
            notifications={notifications}
            setNotifications={setNotifications}
            vendorCustomerLinks={vendorCustomerLinks}
            setVendorCustomerLinks={setVendorCustomerLinks}
            shopDetails={loggedInVendor}
            onUpdateShopDetails={handleShopDetailsUpdate}
            theme={theme}
            toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          />;
        }
         setCurrentView(View.WELCOME); 
         return null;
      case View.CUSTOMER_DASHBOARD:
        if (loggedInCustomer) {
          return <CustomerDashboard 
            customer={loggedInCustomer} 
            onLogout={handleLogout} 
            vendors={vendors}
            transactions={transactions}
            notifications={notifications}
            setNotifications={setNotifications}
            theme={theme}
            toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          />;
        }
        setCurrentView(View.WELCOME); 
        return null;
      case View.WELCOME:
      default:
        return (
          <Welcome
            onVendorLogin={() => setCurrentView(View.VENDOR_LOGIN)}
            onCustomerLogin={() => setCurrentView(View.CUSTOMER_LOGIN)}
            onRegisterShop={() => setCurrentView(View.VENDOR_REGISTRATION)}
          />
        );
    }
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <div className={`min-h-screen w-full text-content-light-primary dark:text-content-dark-primary ${isAuthView ? 'flex flex-col items-center justify-center p-4' : ''}`}>
      {renderView()}
    </div>
  );
};

export default App;