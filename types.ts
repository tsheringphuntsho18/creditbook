export enum ShopType {
  GROCERY = 'Grocery',
  HARDWARE = 'Hardware',
  PHARMACY = 'Pharmacy',
  GENERAL_STORE = 'General Store',
  OTHER = 'Other'
}

export enum ShopStatus {
  OPEN = 'Open',
  CLOSED = 'Closed'
}

export interface VendorRegistrationData {
  fullName: string;
  phoneNumber: string;
  shopName: string;
  shopType: ShopType;
  shopLocation: string;
  password: string;
  shopDescription?: string;
  shopStatus?: ShopStatus;
  shopLogo?: string;
}

export enum TransactionType {
  CREDIT = 'Credit', // Items taken by customer
  PAYMENT = 'Payment', // Money received from customer
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  vendorId: string;
  customerId: string;
}

export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
}

export type CustomerWithBalance = Customer & {
    balance: number;
    transactions: Transaction[];
}

export type SortKey = 'default' | 'name' | 'balance';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
    key: SortKey;
    direction: SortDirection;
}

export enum View {
    WELCOME,
    VENDOR_LOGIN,
    CUSTOMER_LOGIN,
    VENDOR_REGISTRATION,
    VENDOR_DASHBOARD,
    CUSTOMER_DASHBOARD,
}

export type Theme = 'light' | 'dark';

export enum NotificationType {
  REMINDER = 'Reminder',
  NEW_CUSTOMER = 'Welcome',
  CREDIT = 'Credit Added',
  PAYMENT = 'Payment Received',
}

export interface Notification {
  id: string;
  customerId: string; // phone number
  vendorId: string; // phone number
  vendorShopName: string;
  message: string;
  type: NotificationType;
  date: string;
  read: boolean;
}