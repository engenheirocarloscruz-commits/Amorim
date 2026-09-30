import React, { useState } from 'react';
import { FinancialGoal } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface MakeDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: FinancialGoal | null;
  onDeposit: (goalId: string, amount: number, contributor: string, note?: string) => void;
}

export const MakeDepositModal: React.FC<MakeDepositModalProps> = ({
  isOpen,
  onClose,
  goal,
  onDeposit,
}) => {
  const [amount, setAmount] = useState('');
  const [contributor, setContributor] = useState('Carlos Cruz');
  const [note, setNote] = useState('');

  if (!isOpen || !goal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) return;

    onDeposit(goal.id, parsedAmount, contributor, note);
    onClose();
    setAmount('');
    setNote('');
  };

  const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#131b2e] border border-[#464554]/50 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#464554]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3]">savings</span>
            <h2 className="text-headline-md font-bold text-[#dae2fd]">
              Realizar Aporte
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#908fa0] hover:text-[#dae2fd] p-1 rounded-md"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Goal summary header */}
        <div className="my-4 p-4 rounded-xl bg-[#0b1326] border border-[#464554]/30">
          <div className="flex items-center justify-between">
            <h3 className="text-body-lg font-semibold text-[#dae2fd]">
              {goal.title}
            </h3>
            <span className="text-label-caps text-[#4edea3] font-bold">
              {progress}% acumulado
            </span>
          </div>
          <div className="flex justify-between text-body-sm text-[#908fa0] mt-1">
            <span>Atual: {formatCurrency(goal.currentAmount)}</span>
            <span>Alvo: {formatCurrency(goal.targetAmount)}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#2d3449] overflow-hidden mt-2">
            <div className="h-full bg-[#4edea3] rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-label-caps text-[#908fa0] block mb-1">
              VALOR DO APORTE (€)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-[#908fa0]">
                €
              </span>
              <input
                type="text"
                placeholder={goal.monthlyDeposit.toString()}
                required
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-headline-md font-bold focus:outline-none focus:border-[#4edea3]"
              />
            </div>
          </div>

          <div>
            <label className="text-label-caps text-[#908fa0] block mb-1">
              MEMBRO CONTRIBUINTE
            </label>
            <select
              value={contributor}
              onChange={(e) => setContributor(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-md focus:outline-none focus:border-[#4edea3]"
            >
              <option value="Carlos Cruz">Carlos Cruz (Admin)</option>
              <option value="Mariana Oliveira">Mariana Oliveira</option>
              <option value="Fundo Conjunto Familiar">Fundo Conjunto Familiar</option>
            </select>
          </div>

          <div>
            <label className="text-label-caps text-[#908fa0] block mb-1">
              NOTA / OBSERVAÇÃO (OPCIONAL)
            </label>
            <input
              type="text"
              placeholder="Ex: Aporte extraordinário de bônus"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-sm focus:outline-none focus:border-[#4edea3]"
            />
          </div>

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
              className="px-5 py-2.5 rounded-lg bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] font-bold text-body-md shadow-md active:scale-[0.98] cursor-pointer"
            >
              Confirmar Aporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
