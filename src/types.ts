export type NavigationTab = 
  | 'dashboard' 
  | 'transactions' 
  | 'budgets' 
  | 'accounts' 
  | 'settings' 
  | 'support';

export interface BudgetCategory {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  spent: number;
  limit: number;
  colorTheme: 'primary' | 'secondary' | 'tertiary' | 'error';
  statusBadge: string;
  statusType: 'healthy' | 'warning' | 'critical' | 'exceeded' | 'neutral';
}

export interface FinancialGoal {
  id: string;
  title: string;
  description: string;
  icon: string;
  currentAmount: number;
  targetAmount: number;
  monthlyDeposit: number;
  targetDate: string;
  color: 'primary' | 'secondary' | 'surface-tint';
}

export interface GoalDeposit {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  contributor: string;
  note?: string;
}

export interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: 'expense' | 'income' | 'investment';
  date: string;
  account: string;
  paymentMethod: string;
  status: 'settled' | 'pending';
}

export interface FinancialAccount {
  id: string;
  name: string;
  institution: string;
  type: 'checking' | 'credit' | 'investment';
  balance: number;
  limit?: number;
  availableLimit?: number;
  cardLastDigits?: string;
  closingDay?: number;
  dueDay?: number;
  color: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'success' | 'info';
  read: boolean;
}
