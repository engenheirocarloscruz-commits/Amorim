import React from 'react';
import { GoalDeposit, FinancialGoal } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface GoalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  deposits: GoalDeposit[];
  goals: FinancialGoal[];
}

export const GoalHistoryModal: React.FC<GoalHistoryModalProps> = ({
  isOpen,
  onClose,
  deposits,
  goals,
}) => {
  if (!isOpen) return null;

  const getGoalTitle = (goalId: string) => {
    const found = goals.find((g) => g.id === goalId);
    return found ? found.title : 'Meta Familiar';
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#131b2e] border border-[#464554]/50 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#464554]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3]">history</span>
            <h2 className="text-headline-md font-bold text-[#dae2fd]">
              Histórico de Aportes em Metas
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#908fa0] hover:text-[#dae2fd] p-1 rounded-md"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="my-4 max-h-[60vh] overflow-y-auto">
          {deposits.length === 0 ? (
            <p className="text-center py-8 text-[#908fa0]">
              Nenhum aporte registrado até o momento.
            </p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#464554]/30 text-label-caps text-[#908fa0]">
                  <th className="pb-2">META</th>
                  <th className="pb-2">CONTRIBUINTE</th>
                  <th className="pb-2">DATA</th>
                  <th className="pb-2 text-right">VALOR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#464554]/20 text-body-sm">
                {deposits.map((dep) => (
                  <tr key={dep.id} className="hover:bg-[#171f33]/50">
                    <td className="py-3 font-semibold text-[#dae2fd]">
                      {getGoalTitle(dep.goalId)}
                      {dep.note && (
                        <span className="block text-[11px] font-normal text-[#908fa0]">
                          {dep.note}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-[#c7c4d7]">{dep.contributor}</td>
                    <td className="py-3 text-[#908fa0]">{dep.date}</td>
                    <td className="py-3 text-right font-tabular-numeric-md font-bold text-[#4edea3]">
                      + {formatCurrency(dep.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="pt-3 border-t border-[#464554]/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#222a3d] hover:bg-[#171f33] text-[#dae2fd] font-medium text-body-md"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
