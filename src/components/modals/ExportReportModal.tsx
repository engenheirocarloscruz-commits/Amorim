import React from 'react';
import { BudgetCategory, FinancialGoal, Transaction } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPeriod: string;
  budgets: BudgetCategory[];
  goals: FinancialGoal[];
  transactions: Transaction[];
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  selectedPeriod,
  budgets,
  goals,
  transactions,
}) => {
  if (!isOpen) return null;

  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const totalLimit = budgets.reduce((acc, b) => acc + b.limit, 0);
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({ period: selectedPeriod, budgets, goals, transactions, exportedAt: new Date().toISOString() }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `wealthflow_relatorio_${selectedPeriod.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#131b2e] border border-[#464554]/50 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#464554]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c0c1ff]">description</span>
            <h2 className="text-headline-md font-bold text-[#dae2fd]">
              Relatório Executivo de Planejamento
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#908fa0] hover:text-[#dae2fd] p-1 rounded-md"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Report Preview card */}
        <div className="my-4 p-5 rounded-xl bg-[#0b1326] border border-[#464554]/30 space-y-4 text-body-sm">
          <div className="flex justify-between border-b border-[#464554]/20 pb-2">
            <span className="text-[#908fa0]">Período de Referência:</span>
            <span className="font-semibold text-[#dae2fd]">{selectedPeriod}</span>
          </div>
          <div className="flex justify-between border-b border-[#464554]/20 pb-2">
            <span className="text-[#908fa0]">Receitas Registradas:</span>
            <span className="font-semibold text-[#4edea3]">{formatCurrency(totalIncome || 14500)}</span>
          </div>
          <div className="flex justify-between border-b border-[#464554]/20 pb-2">
            <span className="text-[#908fa0]">Teto Global Previsto:</span>
            <span className="font-semibold text-[#dae2fd]">{formatCurrency(totalLimit)}</span>
          </div>
          <div className="flex justify-between border-b border-[#464554]/20 pb-2">
            <span className="text-[#908fa0]">Despesas Executadas:</span>
            <span className="font-semibold text-[#ffb2b7]">{formatCurrency(totalSpent)}</span>
          </div>
          <div className="flex justify-between border-b border-[#464554]/20 pb-2">
            <span className="text-[#908fa0]">Percentual Consumido:</span>
            <span className="font-semibold text-[#c0c1ff]">{formatPercentage((totalSpent / totalLimit) * 100)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#908fa0]">Metas de Poupança Ativas:</span>
            <span className="font-semibold text-[#dae2fd]">{goals.length} metas familiares</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#464554]/30">
          <button
            onClick={handleDownloadJSON}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#222a3d] hover:bg-[#171f33] text-[#c0c1ff] border border-[#464554]/40 font-medium text-body-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Baixar JSON</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-body-md text-[#908fa0] hover:text-[#dae2fd] cursor-pointer"
            >
              Fechar
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-[#c0c1ff] hover:bg-[#a5a7ff] text-[#1000a9] font-bold text-body-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Imprimir / Salvar PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
