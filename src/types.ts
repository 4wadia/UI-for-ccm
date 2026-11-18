export type ScreenId = 'home' | 'cards' | 'analytics';

export type ViewMode = 'device' | 'showcase';

export type IndianBank =
  | 'HDFC Bank'
  | 'ICICI Bank'
  | 'SBI Card'
  | 'Axis Bank'
  | 'Kotak Mahindra Bank'
  | 'IndusInd Bank'
  | 'Bank of Baroda'
  | 'Punjab National Bank'
  | 'IDFC FIRST Bank'
  | 'RBL Bank'
  | 'Yes Bank'
  | 'AU Small Finance Bank'
  | 'Federal Bank';

export type CardSupplier = 'rupay' | 'visa' | 'mastercard' | 'amex' | 'diners';

export interface Transaction {
  id: string;
  title: string;
  category: 'Tech' | 'Income' | 'Food & Dining' | 'Software' | 'Groceries' | 'Transport' | 'Health' | 'Travel' | 'Subscriptions' | 'Shopping' | 'Entertainment' | 'Transfer';
  amount: number; // in INR
  type: 'expense' | 'income';
  date: string;
  time: string;
  cardLast4: string;
  cardBank?: IndianBank;
  cardBrand?: CardSupplier;
  merchant: string;
  referenceId: string;
  iconName: string;
  status: 'completed' | 'pending';
  isUpi?: boolean;
}

export interface CreditCard {
  id: string;
  bankName: IndianBank;
  holderName: string;
  cardNumber: string;
  maskedNumber: string;
  expiry: string;
  cvv: string;
  balance: number; // Current spend / outstanding in INR
  limit: number;   // Approved credit limit in INR
  brand: CardSupplier;
  cardTier: string;
  theme: 'sage' | 'herb' | 'cream' | 'dark' | 'forest' | 'mint' | 'obsidian' | 'emerald' | 'graphite';
  cardGradient?: string;
  isLightCard?: boolean;
  isFrozen: boolean;
  dailyLimit: number;
  currentDailySpent: number;
  contactlessEnabled: boolean;
  onlinePaymentsEnabled: boolean;
  internationalEnabled: boolean;
}

export interface Recipient {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  initials: string;
  color: string;
  bankName: string;
}

export interface SavingsVault {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  iconName: string;
  dueDate: string;
  color: string;
}

export interface CategoryBudget {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  iconName: string;
  color: string;
}

export interface SpendingDataPoint {
  label: string;
  fullDate: string;
  expense: number;
  income: number;
}
