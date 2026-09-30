import React, { useState } from 'react';
import { useAuth } from '../../firebase/authContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInAsGuest,
    logout,
    authError,
    clearAuthError,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setSubmitting(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, displayName || 'Utilizador');
      }
      onClose();
    } catch {
      // error handled in context
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch {
      // error handled in context
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuest = async () => {
    setSubmitting(true);
    try {
      await signInAsGuest();
      onClose();
    } catch {
      // error handled in context
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#131b2e] border border-[#464554]/50 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#464554]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#8083ff]/15 border border-[#8083ff]/30 flex items-center justify-center text-[#c0c1ff]">
              <span className="material-symbols-outlined text-[20px]">cloud_sync</span>
            </div>
            <div>
              <h2 className="text-headline-md font-bold text-[#dae2fd]">
                {user ? 'Conta Firebase' : mode === 'signin' ? 'Iniciar Sessão' : 'Criar Conta'}
              </h2>
              <p className="text-[12px] text-[#908fa0]">
                {user ? 'Sincronização em Nuvem Ativa' : 'Persistência em tempo real no Firestore'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#908fa0] hover:text-[#dae2fd] p-1 rounded-md cursor-pointer"
            aria-label="Fechar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {user ? (
          /* User is already logged in */
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-xl bg-[#0b1326] border border-[#464554]/30 flex items-center gap-3.5">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Avatar'}
                  className="w-12 h-12 rounded-full border border-[#8083ff]/50 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#8083ff]/20 border border-[#8083ff]/40 flex items-center justify-center text-primary font-bold text-headline-sm">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-body-md text-[#dae2fd] truncate">
                  {user.displayName || (user.isAnonymous ? 'Convidado Familiar' : 'Utilizador')}
                </p>
                <p className="text-[12px] text-[#908fa0] truncate">
                  {user.email || 'Sessão anónima ativa'}
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#4edea3]">
                  <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
                  <span>Conectado ao Cloud Firestore</span>
                </div>
              </div>
            </div>

            <div className="text-[12px] text-[#908fa0] bg-[#171f33]/60 p-3 rounded-lg border border-[#464554]/20">
              Todos os seus orçamentos, lançamentos e metas financeiras são sincronizados instantaneamente em tempo real na nuvem do Firebase.
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl bg-[#ff516a]/15 hover:bg-[#ff516a]/25 text-[#ffb2b7] border border-[#ff516a]/30 font-semibold text-body-md transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Terminar Sessão
            </button>
          </div>
        ) : (
          /* Login / Sign Up Forms */
          <div className="mt-4 space-y-4">
            {authError && (
              <div className="p-3 rounded-lg bg-[#ff516a]/15 border border-[#ff516a]/30 text-[#ffb2b7] text-body-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                <span>{authError}</span>
              </div>
            )}

            {/* Google One-Click Button */}
            <button
              type="button"
              disabled={submitting}
              onClick={handleGoogle}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-body-md transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.07.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.13C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.59H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.41l4.04-3.13z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.59l4.04 3.13c.95-2.84 3.6-4.95 6.72-4.95z"
                />
              </svg>
              <span>Continuar com Google</span>
            </button>

            <div className="flex items-center gap-3 my-2 text-[12px] text-[#908fa0]">
              <div className="h-px flex-1 bg-[#464554]/30" />
              <span>ou por e-mail</span>
              <div className="h-px flex-1 bg-[#464554]/30" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'signup' && (
                <div>
                  <label className="text-body-sm text-[#dae2fd] block mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ex: Carlos Cruz"
                    className="w-full px-3 py-2 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-sm focus:border-[#c0c1ff] outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-body-sm text-[#dae2fd] block mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-3 py-2 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-sm focus:border-[#c0c1ff] outline-none"
                />
              </div>

              <div>
                <label className="text-body-sm text-[#dae2fd] block mb-1">Palavra-passe</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-3 py-2 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-sm focus:border-[#c0c1ff] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-[#8083ff] hover:bg-[#6c6fef] text-white font-semibold text-body-md transition-colors cursor-pointer disabled:opacity-50 mt-1"
              >
                {submitting ? 'A processar...' : mode === 'signin' ? 'Entrar' : 'Criar Conta'}
              </button>
            </form>

            <div className="flex items-center justify-between pt-2 border-t border-[#464554]/30 text-body-sm">
              <button
                type="button"
                onClick={() => {
                  clearAuthError();
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                }}
                className="text-[#c0c1ff] hover:underline cursor-pointer"
              >
                {mode === 'signin' ? 'Não tem conta? Registe-se' : 'Já tem conta? Iniciar Sessão'}
              </button>

              <button
                type="button"
                onClick={handleGuest}
                disabled={submitting}
                className="text-[#908fa0] hover:text-[#dae2fd] text-[12px] underline cursor-pointer"
              >
                Entrar como Convidado
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
