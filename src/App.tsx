/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  NavigationTab,
  BudgetCategory,
  FinancialGoal,
  Transaction,
  FinancialAccount,
  GoalDeposit,
  NotificationItem,
} from './types';
import {
  INITIAL_BUDGETS,
  INITIAL_GOALS,
  INITIAL_TRANSACTIONS,
  INITIAL_ACCOUNTS,
  INITIAL_DEPOSITS,
  INITIAL_NOTIFICATIONS,
} from './data/initialData';
import { SideNav } from './components/SideNav';
import { TopNav } from './components/TopNav';
import { BudgetsAndGoalsScreen } from './screens/BudgetsAndGoalsScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { TransactionsScreen } from './screens/TransactionsScreen';
import { AccountsScreen } from './screens/AccountsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SupportScreen } from './screens/SupportScreen';

// Modals
import { NewTransactionModal } from './components/modals/NewTransactionModal';
import { NewBudgetModal } from './components/modals/NewBudgetModal';
import { NewGoalModal } from './components/modals/NewGoalModal';
import { MakeDepositModal } from './components/modals/MakeDepositModal';
import { GoalHistoryModal } from './components/modals/GoalHistoryModal';
import { PeriodFilterModal } from './components/modals/PeriodFilterModal';
import { ExportReportModal } from './components/modals/ExportReportModal';
import { AuthModal } from './components/modals/AuthModal';

// Firebase
import { AuthProvider, useAuth } from './firebase/authContext';
import {
  seedUserDataIfEmpty,
  subscribeToUserData,
  addTransactionToFirestore,
  deleteTransactionFromFirestore,
  addBudgetToFirestore,
  updateBudgetInFirestore,
  addGoalToFirestore,
  depositToGoalInFirestore,
  markNotificationReadInFirestore,
  addAccountToFirestore,
  resetUserDataInFirestore,
} from './firebase/firestoreService';
import { formatCurrency } from './utils/formatters';

function WealthFlowApp() {
  const { user } = useAuth();

  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const saved = localStorage.getItem('wealthflow_selected_period');
    return saved ? saved.replace(/\s*\d{4}/g, '').trim() || 'Março' : 'Março';
  });

  // Core Data States - Starts completely zeroed
  const [budgets, setBudgets] = useState<BudgetCategory[]>(() => {
    const isZeroed = localStorage.getItem('wealthflow_zeroed_v2');
    if (!isZeroed) return INITIAL_BUDGETS;
    const saved = localStorage.getItem('wealthflow_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    const isZeroed = localStorage.getItem('wealthflow_zeroed_v2');
    if (!isZeroed) return INITIAL_GOALS;
    const saved = localStorage.getItem('wealthflow_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const isZeroed = localStorage.getItem('wealthflow_zeroed_v2');
    if (!isZeroed) return INITIAL_TRANSACTIONS;
    const saved = localStorage.getItem('wealthflow_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [accounts, setAccounts] = useState<FinancialAccount[]>(() => {
    const isZeroed = localStorage.getItem('wealthflow_zeroed_v2');
    if (!isZeroed) return INITIAL_ACCOUNTS;
    const saved = localStorage.getItem('wealthflow_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [deposits, setDeposits] = useState<GoalDeposit[]>(() => {
    const isZeroed = localStorage.getItem('wealthflow_zeroed_v2');
    if (!isZeroed) return INITIAL_DEPOSITS;
    const saved = localStorage.getItem('wealthflow_deposits');
    return saved ? JSON.parse(saved) : INITIAL_DEPOSITS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const isZeroed = localStorage.getItem('wealthflow_zeroed_v2');
    if (!isZeroed) return INITIAL_NOTIFICATIONS;
    const saved = localStorage.getItem('wealthflow_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Startup zero-reset migration
  useEffect(() => {
    const isZeroed = localStorage.getItem('wealthflow_zeroed_v2');
    if (!isZeroed) {
      localStorage.setItem('wealthflow_zeroed_v2', 'true');
      setBudgets(INITIAL_BUDGETS);
      setGoals(INITIAL_GOALS);
      setTransactions([]);
      setAccounts(INITIAL_ACCOUNTS);
      setDeposits([]);
      setNotifications([]);
      if (user) {
        resetUserDataInFirestore(user.uid).catch(console.error);
      }
    }
  }, [user]);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  // Local Storage Fallback Persistence
  useEffect(() => {
    localStorage.setItem('wealthflow_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('wealthflow_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('wealthflow_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('wealthflow_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('wealthflow_deposits', JSON.stringify(deposits));
  }, [deposits]);

  useEffect(() => {
    localStorage.setItem('wealthflow_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('wealthflow_selected_period', selectedPeriod);
  }, [selectedPeriod]);

  // Real-time Cloud Sync with Firebase Firestore
  useEffect(() => {
    if (!user) return;

    // Seed default data if new user
    seedUserDataIfEmpty(user.uid);

    // Subscribe to real-time snapshots
    const unsubscribe = subscribeToUserData(user.uid, {
      onBudgets: (cloudBudgets) => {
        if (cloudBudgets.length > 0) setBudgets(cloudBudgets);
      },
      onTransactions: (cloudTxs) => {
        setTransactions(cloudTxs);
      },
      onAccounts: (cloudAccounts) => {
        if (cloudAccounts.length > 0) setAccounts(cloudAccounts);
      },
      onGoals: (cloudGoals) => {
        if (cloudGoals.length > 0) setGoals(cloudGoals);
      },
      onNotifications: (cloudNotifs) => {
        if (cloudNotifs.length > 0) setNotifications(cloudNotifs);
      },
    });

    return () => unsubscribe();
  }, [user]);

  // Modals state
  const [isNewTxModalOpen, setIsNewTxModalOpen] = useState(false);
  const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState<BudgetCategory | null>(null);
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [goalToDeposit, setGoalToDeposit] = useState<FinancialGoal | null>(null);
  const [isGoalHistoryModalOpen, setIsGoalHistoryModalOpen] = useState(false);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Handlers
  const handleAddTransaction = async (newTx: Omit<Transaction, 'id'>) => {
    const id = `tx-${Date.now()}`;
    const tx: Transaction = { id, ...newTx };

    setTransactions((prev) => [tx, ...prev]);

    // If it's an expense and matches a category, update the category's spent amount
    if (newTx.type === 'expense') {
      setBudgets((prev) =>
        prev.map((b) => {
          if (b.name.toLowerCase() === newTx.category.toLowerCase()) {
            const updatedSpent = b.spent + newTx.amount;
            const pct = Math.round((updatedSpent / b.limit) * 100);
            const updated = {
              ...b,
              spent: updatedSpent,
              statusBadge:
                pct > 100
                  ? `${pct}% Excedido`
                  : pct >= 95
                  ? `${pct}% Alerta`
                  : `${pct}%`,
              statusType:
                pct > 100
                  ? ('exceeded' as const)
                  : pct >= 95
                  ? ('critical' as const)
                  : pct >= 85
                  ? ('warning' as const)
                  : ('healthy' as const),
            };

            if (user) {
              updateBudgetInFirestore(user.uid, updated).catch(console.error);
            }
            return updated;
          }
          return b;
        })
      );
    }

    if (user) {
      addTransactionToFirestore(user.uid, tx).catch(console.error);
    }

    showToast(`Lançamento "${newTx.description}" registrado na nuvem!`);
  };

  const handleDeleteTransaction = async (id: string) => {
    const txToDelete = transactions.find((t) => t.id === id);
    if (!txToDelete) return;

    if (txToDelete.type === 'expense') {
      setBudgets((prev) =>
        prev.map((b) => {
          if (b.name.toLowerCase() === txToDelete.category.toLowerCase()) {
            const updatedSpent = Math.max(0, b.spent - txToDelete.amount);
            const pct = Math.round((updatedSpent / b.limit) * 100);
            const updated = {
              ...b,
              spent: updatedSpent,
              statusBadge: `${pct}%`,
            };
            if (user) {
              updateBudgetInFirestore(user.uid, updated).catch(console.error);
            }
            return updated;
          }
          return b;
        })
      );
    }

    setTransactions((prev) => prev.filter((t) => t.id !== id));

    if (user) {
      deleteTransactionFromFirestore(user.uid, id).catch(console.error);
    }

    showToast('Lançamento removido do extrato e sincronizado.');
  };

  const handleSaveBudget = async (data: Partial<BudgetCategory>) => {
    if (data.id) {
      // Editing existing budget
      let updatedCat: BudgetCategory | undefined;
      setBudgets((prev) =>
        prev.map((b) => {
          if (b.id === data.id) {
            const newLimit = data.limit || b.limit;
            const pct = Math.round((b.spent / newLimit) * 100);
            updatedCat = {
              ...b,
              name: data.name || b.name,
              subtitle: data.subtitle || b.subtitle,
              limit: newLimit,
              icon: data.icon || b.icon,
              statusBadge:
                pct > 100
                  ? `${pct}% Excedido`
                  : pct >= 95
                  ? `${pct}% Alerta`
                  : `${pct}%`,
              statusType:
                pct > 100
                  ? 'exceeded'
                  : pct >= 95
                  ? 'critical'
                  : pct >= 85
                  ? 'warning'
                  : 'healthy',
            };
            return updatedCat;
          }
          return b;
        })
      );

      if (user && updatedCat) {
        updateBudgetInFirestore(user.uid, updatedCat).catch(console.error);
      }
      showToast(`Teto do orçamento "${data.name}" atualizado na nuvem!`);
    } else {
      // Creating new budget category
      const newCategory: BudgetCategory = {
        id: `cat-${Date.now()}`,
        name: data.name || 'Nova Categoria',
        subtitle: data.subtitle || 'Despesas gerais',
        icon: data.icon || 'shopping_basket',
        spent: 0,
        limit: data.limit || 1000,
        colorTheme: 'primary',
        statusBadge: '0% Saudável',
        statusType: 'healthy',
      };
      setBudgets((prev) => [...prev, newCategory]);
      if (user) {
        addBudgetToFirestore(user.uid, newCategory).catch(console.error);
      }
      showToast(`Novo orçamento "${newCategory.name}" criado na nuvem!`);
    }
  };

  const handleSaveGoal = async (goalData: Omit<FinancialGoal, 'id'>) => {
    const newGoal: FinancialGoal = {
      id: `goal-${Date.now()}`,
      ...goalData,
    };
    setGoals((prev) => [...prev, newGoal]);
    if (user) {
      addGoalToFirestore(user.uid, newGoal).catch(console.error);
    }
    showToast(`Meta "${newGoal.title}" criada com sucesso na nuvem!`);
  };

  const handleMakeDeposit = async (
    goalId: string,
    amount: number,
    contributor: string,
    note?: string
  ) => {
    let targetGoal: FinancialGoal | undefined;
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          targetGoal = {
            ...g,
            currentAmount: g.currentAmount + amount,
          };
          return targetGoal;
        }
        return g;
      })
    );

    const newDeposit: GoalDeposit = {
      id: `dep-${Date.now()}`,
      goalId,
      amount,
      contributor,
      date: new Date().toLocaleDateString('pt-PT'),
      note,
    };
    setDeposits((prev) => [newDeposit, ...prev]);

    if (user && targetGoal) {
      depositToGoalInFirestore(user.uid, newDeposit, targetGoal.currentAmount).catch(console.error);
    }

    // Register transaction as investment
    const goalFound = goals.find((g) => g.id === goalId);
    handleAddTransaction({
      description: `Aporte Meta: ${goalFound?.title || 'Sonho Familiar'}`,
      amount,
      type: 'investment',
      category: 'Investimentos',
      account: 'XP Investimentos',
      paymentMethod: 'Aplicação Direta',
      date: new Date().toISOString().slice(0, 10),
      status: 'settled',
    });

    showToast(`Aporte de ${formatCurrency(amount)} realizado e sincronizado! 🎉`);
  };

  const handleResetData = async () => {
    setBudgets(INITIAL_BUDGETS);
    setGoals(INITIAL_GOALS);
    setTransactions(INITIAL_TRANSACTIONS);
    setAccounts(INITIAL_ACCOUNTS);
    setDeposits(INITIAL_DEPOSITS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
    localStorage.setItem('wealthflow_zeroed_v2', 'true');
    if (user) {
      await resetUserDataInFirestore(user.uid);
    }
    showToast('Todos os valores foram zerados com sucesso!');
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    if (user) {
      markNotificationReadInFirestore(user.uid, id).catch(console.error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b1326] text-[#dae2fd]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#171f33] border border-[#8083ff]/40 shadow-2xl text-[#dae2fd] text-body-md animate-in slide-in-from-bottom-5 duration-200">
          <span className="material-symbols-outlined text-[#4edea3] text-[20px]">
            cloud_done
          </span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-[#908fa0] hover:text-[#dae2fd]"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Main Side Navigation */}
      <SideNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenNewTransaction={() => setIsNewTxModalOpen(true)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedPeriod={selectedPeriod}
          onOpenPeriodFilter={() => setIsPeriodModalOpen(true)}
          onOpenExportReport={() => setIsExportModalOpen(true)}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1680px] w-full mx-auto">
          {activeTab === 'budgets' && (
            <BudgetsAndGoalsScreen
              budgets={budgets}
              goals={goals}
              transactions={transactions}
              selectedPeriod={selectedPeriod}
              onOpenNewBudgetModal={() => {
                setBudgetToEdit(null);
                setIsNewBudgetModalOpen(true);
              }}
              onOpenNewGoalModal={() => setIsNewGoalModalOpen(true)}
              onOpenDepositModal={(goal) => {
                setGoalToDeposit(goal);
                setIsDepositModalOpen(true);
              }}
              onOpenGoalHistory={() => setIsGoalHistoryModalOpen(true)}
              onEditBudget={(budget) => {
                setBudgetToEdit(budget);
                setIsNewBudgetModalOpen(true);
              }}
              onOpenNewTransaction={() => setIsNewTxModalOpen(true)}
              searchTerm={searchTerm}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardScreen
              budgets={budgets}
              goals={goals}
              transactions={transactions}
              accounts={accounts}
              selectedPeriod={selectedPeriod}
              onNavigateToTab={setActiveTab}
              onOpenNewTransaction={() => setIsNewTxModalOpen(true)}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsScreen
              transactions={transactions}
              budgets={budgets}
              onOpenNewTransaction={() => setIsNewTxModalOpen(true)}
              onDeleteTransaction={handleDeleteTransaction}
              searchTerm={searchTerm}
            />
          )}

          {activeTab === 'accounts' && (
            <AccountsScreen
              accounts={accounts}
              onAddAccount={() => {
                const newAcc: FinancialAccount = {
                  id: `acc-${Date.now()}`,
                  name: 'Nova Conta Bancária',
                  institution: 'Banco Principal',
                  type: 'checking',
                  balance: 1000,
                  color: 'primary',
                };
                setAccounts((prev) => [...prev, newAcc]);
                if (user) {
                  addAccountToFirestore(user.uid, newAcc).catch(console.error);
                }
                showToast('Conta criada com sucesso na nuvem!');
              }}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen onResetData={handleResetData} />
          )}

          {activeTab === 'support' && <SupportScreen />}
        </main>
      </div>

      {/* Interactive Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <NewTransactionModal
        isOpen={isNewTxModalOpen}
        onClose={() => setIsNewTxModalOpen(false)}
        budgets={budgets}
        accounts={accounts}
        onAddTransaction={handleAddTransaction}
      />

      <NewBudgetModal
        isOpen={isNewBudgetModalOpen}
        onClose={() => {
          setIsNewBudgetModalOpen(false);
          setBudgetToEdit(null);
        }}
        onSaveBudget={handleSaveBudget}
        budgetToEdit={budgetToEdit}
      />

      <NewGoalModal
        isOpen={isNewGoalModalOpen}
        onClose={() => setIsNewGoalModalOpen(false)}
        onSaveGoal={handleSaveGoal}
      />

      <MakeDepositModal
        isOpen={isDepositModalOpen}
        onClose={() => {
          setIsDepositModalOpen(false);
          setGoalToDeposit(null);
        }}
        goal={goalToDeposit}
        onDeposit={handleMakeDeposit}
      />

      <GoalHistoryModal
        isOpen={isGoalHistoryModalOpen}
        onClose={() => setIsGoalHistoryModalOpen(false)}
        deposits={deposits}
        goals={goals}
      />

      <PeriodFilterModal
        isOpen={isPeriodModalOpen}
        onClose={() => setIsPeriodModalOpen(false)}
        selectedPeriod={selectedPeriod}
        onSelectPeriod={(p) => {
          setSelectedPeriod(p);
          showToast(`Período de planeamento alterado para ${p}`);
        }}
      />

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        selectedPeriod={selectedPeriod}
        budgets={budgets}
        goals={goals}
        transactions={transactions}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WealthFlowApp />
    </AuthProvider>
  );
}
