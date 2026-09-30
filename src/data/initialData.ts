import { BudgetCategory, FinancialGoal, FinancialAccount, Transaction, GoalDeposit, NotificationItem } from '../types';

export const INITIAL_BUDGETS: BudgetCategory[] = [
  {
    id: 'food',
    name: 'Alimentação & Mercado',
    subtitle: 'Supermercados, hortifrúti',
    icon: 'shopping_basket',
    spent: 0,
    limit: 0,
    colorTheme: 'primary',
    statusBadge: '0%',
    statusType: 'healthy',
  },
  {
    id: 'housing',
    name: 'Moradia & Contas',
    subtitle: 'Aluguel, energia, internet',
    icon: 'home',
    spent: 0,
    limit: 0,
    colorTheme: 'tertiary',
    statusBadge: '0%',
    statusType: 'healthy',
  },
  {
    id: 'transport',
    name: 'Transporte & Combustível',
    subtitle: 'Gasolina, pedágio, transportes',
    icon: 'directions_car',
    spent: 0,
    limit: 0,
    colorTheme: 'secondary',
    statusBadge: '0%',
    statusType: 'healthy',
  },
  {
    id: 'leisure',
    name: 'Lazer & Restaurantes',
    subtitle: 'Jantares, streaming, eventos',
    icon: 'restaurant',
    spent: 0,
    limit: 0,
    colorTheme: 'error',
    statusBadge: '0%',
    statusType: 'healthy',
  },
  {
    id: 'health',
    name: 'Saúde & Cuidados',
    subtitle: 'Farmácia, consultas, desporto',
    icon: 'medical_services',
    spent: 0,
    limit: 0,
    colorTheme: 'secondary',
    statusBadge: '0%',
    statusType: 'healthy',
  },
  {
    id: 'personal',
    name: 'Compras Pessoais',
    subtitle: 'Vestuário, eletrónicos, livros',
    icon: 'checkroom',
    spent: 0,
    limit: 0,
    colorTheme: 'primary',
    statusBadge: '0%',
    statusType: 'healthy',
  },
];

export const INITIAL_GOALS: FinancialGoal[] = [
  {
    id: 'emergency-fund',
    title: 'Reserva de Emergência',
    description: 'Garantia para despesas essenciais em aplicação segura.',
    icon: 'shield',
    currentAmount: 0,
    targetAmount: 0,
    monthlyDeposit: 0,
    targetDate: 'Definir prazo',
    color: 'secondary',
  },
  {
    id: 'family-vacation',
    title: 'Viagem de Férias',
    description: 'Poupança para viagens e lazer da família.',
    icon: 'flight_takeoff',
    currentAmount: 0,
    targetAmount: 0,
    monthlyDeposit: 0,
    targetDate: 'Definir prazo',
    color: 'primary',
  },
  {
    id: 'car-upgrade',
    title: 'Troca de Carro / Manutenção',
    description: 'Fundo para aquisição ou manutenção veicular.',
    icon: 'car_repair',
    currentAmount: 0,
    targetAmount: 0,
    monthlyDeposit: 0,
    targetDate: 'Definir prazo',
    color: 'surface-tint',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_ACCOUNTS: FinancialAccount[] = [
  {
    id: 'checking-1',
    name: 'Conta Corrente Principal',
    institution: 'Banco Principal',
    type: 'checking',
    balance: 0,
    color: '#8083ff',
  },
  {
    id: 'credit-1',
    name: 'Cartão de Crédito',
    institution: 'Banco Principal',
    type: 'credit',
    balance: 0,
    limit: 0,
    availableLimit: 0,
    closingDay: 25,
    dueDay: 5,
    color: '#ff516a',
  },
  {
    id: 'invest-1',
    name: 'Conta de Investimentos',
    institution: 'Corretora',
    type: 'investment',
    balance: 0,
    color: '#4edea3',
  },
];

export const INITIAL_DEPOSITS: GoalDeposit[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
