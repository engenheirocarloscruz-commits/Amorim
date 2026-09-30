import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db, testFirestoreConnection } from './config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isOnline: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync user profile into Firestore
  const syncUserProfile = async (firebaseUser: User, customName?: string) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          id: firebaseUser.uid,
          email: firebaseUser.email || 'anonimo@wealthflow.app',
          displayName: customName || firebaseUser.displayName || (firebaseUser.isAnonymous ? 'Convidado' : 'Utilizador'),
          photoURL: firebaseUser.photoURL || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('Erro ao sincronizar perfil:', err);
    }
  };

  useEffect(() => {
    testFirestoreConnection().then((ok) => setIsOnline(ok));

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserProfile(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearAuthError = () => setAuthError(null);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        await syncUserProfile(res.user);
      }
    } catch (err: any) {
      console.error('Erro Google Sign-In:', err);
      setAuthError(err.message || 'Falha ao autenticar com o Google.');
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await syncUserProfile(res.user);
      }
    } catch (err: any) {
      console.error('Erro Email Sign-In:', err);
      let msg = 'Erro ao autenticar.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'E-mail ou palavra-passe incorretos.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'E-mail inválido.';
      }
      setAuthError(msg);
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setAuthError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await updateProfile(res.user, { displayName: name });
        await syncUserProfile(res.user, name);
      }
    } catch (err: any) {
      console.error('Erro ao registar utilizador:', err);
      let msg = 'Erro ao criar conta.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'Este e-mail já se encontra registado.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'A palavra-passe deve ter pelo menos 6 caracteres.';
      }
      setAuthError(msg);
      throw err;
    }
  };

  const signInAsGuest = async () => {
    setAuthError(null);
    try {
      const res = await signInAnonymously(auth);
      if (res.user) {
        await syncUserProfile(res.user, 'Convidado Familiar');
      }
    } catch (err: any) {
      console.error('Erro ao entrar como convidado:', err);
      setAuthError('Não foi possível iniciar sessão de convidado.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err: any) {
      console.error('Erro ao sair:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isOnline,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInAsGuest,
        logout,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider');
  }
  return context;
};
