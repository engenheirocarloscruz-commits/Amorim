import React, { useState } from 'react';
import { BudgetCategory, FinancialAccount, Transaction } from '../../types';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgets: BudgetCategory[];
  accounts: FinancialAccount[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  isOpen,
  onClose,
  budgets,
  accounts,
  onAddTransaction,
}) => {
  const [type, setType] = useState<'expense' | 'income' | 'investment'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(budgets[0]?.name || 'Alimentação & Mercado');
  const account = accounts[0]?.name || 'Conta Principal';
  const paymentMethod = 'PIX / Cartão';
  const date = new Date().toISOString().slice(0, 10);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (!parsedAmount || isNaN(parsedAmount)) {
      return;
    }

    const defaultDescription =
      type === 'income'
        ? 'Receita'
        : type === 'investment'
        ? 'Aporte'
        : category;

    onAddTransaction({
      description: defaultDescription,
      amount: parsedAmount,
      type,
      category: type === 'income' ? 'Renda & Proventos' : type === 'investment' ? 'Investimentos' : category,
      account,
      paymentMethod,
      date,
      status: 'settled',
    });

    onClose();
    setAmount('');
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#131b2e] border border-[#464554]/50 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#464554]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8083ff]">add_circle</span>
            <h2 className="text-headline-md font-bold text-[#dae2fd]">
              Novo Lançamento
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#908fa0] hover:text-[#dae2fd] p-1 rounded-md"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Type selector */}
        <div className="grid grid-cols-3 gap-2 my-4 p-1 rounded-lg bg-[#0b1326] border border-[#464554]/30">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`py-2 text-body-sm font-semibold rounded-md transition-colors cursor-pointer ${
              type === 'expense'
                ? 'bg-[#ff516a]/20 text-[#ffb2b7] border border-[#ff516a]/40'
                : 'text-[#908fa0] hover:text-[#dae2fd]'
            }`}
          >
            Despesa
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`py-2 text-body-sm font-semibold rounded-md transition-colors cursor-pointer ${
              type === 'income'
                ? 'bg-[#00a572]/20 text-[#4edea3] border border-[#4edea3]/40'
                : 'text-[#908fa0] hover:text-[#dae2fd]'
            }`}
          >
            Receita
          </button>
          <button
            type="button"
            onClick={() => setType('investment')}
            className={`py-2 text-body-sm font-semibold rounded-md transition-colors cursor-pointer ${
              type === 'investment'
                ? 'bg-[#8083ff]/20 text-[#c0c1ff] border border-[#c0c1ff]/40'
                : 'text-[#908fa0] hover:text-[#dae2fd]'
            }`}
          >
            Aporte / Invest.
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-label-caps text-[#908fa0] block mb-1">
              VALOR (€)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-[#908fa0]">
                €
              </span>
              <input
                type="text"
                placeholder="0,00"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-headline-md font-semibold focus:outline-none focus:border-[#c0c1ff]"
              />
            </div>
          </div>

          {type === 'expense' && (
            <div>
              <label className="text-label-caps text-[#908fa0] block mb-1">
                CATEGORIA DO ORÇAMENTO
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-md focus:outline-none focus:border-[#c0c1ff]"
              >
                {budgets.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name} (Restante: {(b.limit - b.spent).toLocaleString('pt-PT')} €)
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#464554]/30 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-body-md text-[#908fa0] hover:text-[#dae2fd] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#8083ff] hover:bg-[#494bd6] text-[#0d0096] hover:text-white font-semibold text-body-md transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              Confirmar Lançamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
