import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Customer, Notification, NotificationType } from '../types';
import { BellIcon } from './icons/BellIcon';
import { formatDate } from '../utils/dateFormatter';

interface NotificationBellProps {
    customer: Customer;
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const getIconForType = (type: NotificationType) => {
    switch (type) {
        case NotificationType.CREDIT: return <span className="text-danger">▲</span>;
        case NotificationType.PAYMENT: return <span className="text-success">▼</span>;
        case NotificationType.NEW_CUSTOMER: return <span className="text-primary">👋</span>;
        case NotificationType.REMINDER: return <span className="text-yellow-500">🔔</span>;
        default: return '•';
    }
}

const NotificationBell: React.FC<NotificationBellProps> = ({ customer, notifications, setNotifications }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const customerNotifications = useMemo(() => 
        notifications.filter(n => n.customerId === customer.phoneNumber)
    , [notifications, customer.phoneNumber]);

    const unreadCount = useMemo(() => 
        customerNotifications.filter(n => !n.read).length
    , [customerNotifications]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);


    const handleToggle = () => setIsOpen(!isOpen);

const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => 
            n.customerId === customer.phoneNumber ? { ...n, read: true } : n
        ));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={handleToggle} aria-haspopup="true" className="relative">
                <BellIcon />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full bg-primary text-white">{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 left-0 sm:left-auto mt-2 w-full sm:w-80 max-w-xs sm:max-w-none bg-background-light-primary dark:bg-background-dark-secondary rounded-lg shadow-xl border dark:border-gray-700 z-50">
                    <div className="p-3 flex justify-between items-center border-b dark:border-gray-700">
                        <h4 className="font-semibold">Notifications</h4>
                        {unreadCount > 0 && (
                             <button onClick={markAllAsRead} className="text-xs text-primary hover:underline">Mark all as read</button>
                        )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                       {customerNotifications.length === 0 ? (
                            <p className="text-center text-sm text-content-light-secondary dark:text-content-dark-secondary py-6">No notifications yet.</p>
                       ) : (
                            customerNotifications.map(n => (
                                <div key={n.id} className={`p-3 border-b dark:border-gray-700 ${!n.read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}> 
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 break-words">
                                        <div className="pt-1 flex-shrink-0">{getIconForType(n.type)}</div>
                                        <div className="min-w-0 w-full">
                                            <p className="text-sm font-semibold break-words w-full" title={n.vendorShopName}>{n.vendorShopName}</p>
                                            <p className="text-sm break-words whitespace-pre-line w-full" style={{wordBreak: 'break-word'}}>{n.message}</p>
                                            <p className="text-xs text-content-light-secondary dark:text-content-dark-secondary mt-1">{formatDate(n.date)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                       )}
                    </div>
                </div>
            )}
        </div>
    );

};

export default NotificationBell;
