import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import {
  BudgetCategory,
  FinancialGoal,
  FinancialAccount,
  Transaction,
  GoalDeposit,
  NotificationItem,
} from '../types';
import {
  INITIAL_BUDGETS,
  INITIAL_GOALS,
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';

// Seed default data for new users if they have no records
export async function seedUserDataIfEmpty(userId: string) {
  try {
    const budgetCol = collection(db, 'users', userId, 'budgets');
    const snap = await getDocs(budgetCol);

    if (snap.empty) {
      const batch = writeBatch(db);

      // Budgets (zeroed)
      INITIAL_BUDGETS.forEach((b) => {
        const ref = doc(db, 'users', userId, 'budgets', b.id);
        batch.set(ref, b);
      });

      // Accounts (zeroed)
      INITIAL_ACCOUNTS.forEach((a) => {
        const ref = doc(db, 'users', userId, 'accounts', a.id);
        batch.set(ref, a);
      });

      // Goals (zeroed)
      INITIAL_GOALS.forEach((g) => {
        const ref = doc(db, 'users', userId, 'goals', g.id);
        batch.set(ref, g);
      });

      await batch.commit();
    }
  } catch (err) {
    console.warn('Erro ao inicializar dados do utilizador no Firestore:', err);
  }
}

// Reset all user data in Firestore to completely zeroed state
export async function resetUserDataInFirestore(userId: string) {
  try {
    const batch = writeBatch(db);

    // Delete existing transactions
    const txSnap = await getDocs(collection(db, 'users', userId, 'transactions'));
    txSnap.forEach((d) => batch.delete(d.ref));

    // Reset budgets to zero
    INITIAL_BUDGETS.forEach((b) => {
      const ref = doc(db, 'users', userId, 'budgets', b.id);
      batch.set(ref, b);
    });

    // Reset accounts to zero
    INITIAL_ACCOUNTS.forEach((a) => {
      const ref = doc(db, 'users', userId, 'accounts', a.id);
      batch.set(ref, a);
    });

    // Reset goals to zero
    INITIAL_GOALS.forEach((g) => {
      const ref = doc(db, 'users', userId, 'goals', g.id);
      batch.set(ref, g);
    });

    await batch.commit();
  } catch (err) {
    console.error('Erro ao redefinir dados no Firestore:', err);
  }
}

// Subscriptions for real-time synchronization
export function subscribeToUserData(
  userId: string,
  callbacks: {
    onBudgets?: (budgets: BudgetCategory[]) => void;
    onTransactions?: (transactions: Transaction[]) => void;
    onAccounts?: (accounts: FinancialAccount[]) => void;
    onGoals?: (goals: FinancialGoal[]) => void;
    onNotifications?: (notifications: NotificationItem[]) => void;
  }
): () => void {
  const unsubscribes: Unsubscribe[] = [];

  // Budgets
  if (callbacks.onBudgets) {
    const q = collection(db, 'users', userId, 'budgets');
    unsubscribes.push(
      onSnapshot(q, (snapshot) => {
        const list: BudgetCategory[] = [];
        snapshot.forEach((d) => list.push({ ...d.data(), id: d.id } as BudgetCategory));
        callbacks.onBudgets?.(list);
      })
    );
  }

  // Transactions
  if (callbacks.onTransactions) {
    const q = query(collection(db, 'users', userId, 'transactions'), orderBy('date', 'desc'));
    unsubscribes.push(
      onSnapshot(q, (snapshot) => {
        const list: Transaction[] = [];
        snapshot.forEach((d) => list.push({ ...d.data(), id: d.id } as Transaction));
        callbacks.onTransactions?.(list);
      })
    );
  }

  // Accounts
  if (callbacks.onAccounts) {
    const q = collection(db, 'users', userId, 'accounts');
    unsubscribes.push(
      onSnapshot(q, (snapshot) => {
        const list: FinancialAccount[] = [];
        snapshot.forEach((d) => list.push({ ...d.data(), id: d.id } as FinancialAccount));
        callbacks.onAccounts?.(list);
      })
    );
  }

  // Goals
  if (callbacks.onGoals) {
    const q = collection(db, 'users', userId, 'goals');
    unsubscribes.push(
      onSnapshot(q, (snapshot) => {
        const list: FinancialGoal[] = [];
        snapshot.forEach((d) => list.push({ ...d.data(), id: d.id } as FinancialGoal));
        callbacks.onGoals?.(list);
      })
    );
  }

  // Notifications
  if (callbacks.onNotifications) {
    const q = collection(db, 'users', userId, 'notifications');
    unsubscribes.push(
      onSnapshot(q, (snapshot) => {
        const list: NotificationItem[] = [];
        snapshot.forEach((d) => list.push({ ...d.data(), id: d.id } as NotificationItem));
        callbacks.onNotifications?.(list);
      })
    );
  }

  return () => {
    unsubscribes.forEach((unsub) => unsub());
  };
}

// Transaction operations
export async function addTransactionToFirestore(userId: string, tx: Transaction) {
  const ref = doc(db, 'users', userId, 'transactions', tx.id);
  await setDoc(ref, tx);
}

export async function deleteTransactionFromFirestore(userId: string, txId: string) {
  const ref = doc(db, 'users', userId, 'transactions', txId);
  await deleteDoc(ref);
}

// Budget operations
export async function addBudgetToFirestore(userId: string, budget: BudgetCategory) {
  const ref = doc(db, 'users', userId, 'budgets', budget.id);
  await setDoc(ref, budget);
}

export async function updateBudgetInFirestore(userId: string, budget: Partial<BudgetCategory> & { id: string }) {
  const ref = doc(db, 'users', userId, 'budgets', budget.id);
  await updateDoc(ref, budget);
}

// Account operations
export async function addAccountToFirestore(userId: string, account: FinancialAccount) {
  const ref = doc(db, 'users', userId, 'accounts', account.id);
  await setDoc(ref, account);
}

export async function updateAccountInFirestore(userId: string, account: Partial<FinancialAccount> & { id: string }) {
  const ref = doc(db, 'users', userId, 'accounts', account.id);
  await updateDoc(ref, account);
}

// Goal operations
export async function addGoalToFirestore(userId: string, goal: FinancialGoal) {
  const ref = doc(db, 'users', userId, 'goals', goal.id);
  await setDoc(ref, goal);
}

export async function updateGoalInFirestore(userId: string, goal: Partial<FinancialGoal> & { id: string }) {
  const ref = doc(db, 'users', userId, 'goals', goal.id);
  await updateDoc(ref, goal);
}

export async function depositToGoalInFirestore(userId: string, deposit: GoalDeposit, newAmount: number) {
  const batch = writeBatch(db);
  const goalRef = doc(db, 'users', userId, 'goals', deposit.goalId);
  batch.update(goalRef, { currentAmount: newAmount });

  const depositRef = doc(db, 'users', userId, 'goals', deposit.goalId, 'deposits', deposit.id);
  batch.set(depositRef, deposit);

  await batch.commit();
}

// Notifications
export async function markNotificationReadInFirestore(userId: string, notifId: string) {
  const ref = doc(db, 'users', userId, 'notifications', notifId);
  await updateDoc(ref, { read: true });
}
