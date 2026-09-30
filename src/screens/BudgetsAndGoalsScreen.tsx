import React, { useState } from 'react';
import { BudgetCategory, FinancialGoal, Transaction } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface BudgetsAndGoalsScreenProps {
  budgets: BudgetCategory[];
  goals: FinancialGoal[];
  transactions?: Transaction[];
  selectedPeriod: string;
  onOpenNewBudgetModal: () => void;
  onOpenNewGoalModal: () => void;
  onOpenDepositModal: (goal: FinancialGoal) => void;
  onOpenGoalHistory: () => void;
  onEditBudget: (budget: BudgetCategory) => void;
  onOpenNewTransaction?: () => void;
  searchTerm?: string;
}

export const BudgetsAndGoalsScreen: React.FC<BudgetsAndGoalsScreenProps> = ({
  budgets,
  goals,
  transactions = [],
  selectedPeriod,
  onOpenNewBudgetModal,
  onOpenNewGoalModal,
  onOpenDepositModal,
  onOpenGoalHistory,
  onEditBudget,
  onOpenNewTransaction,
  searchTerm = '',
}) => {
  const [sortOrder, setSortOrder] = useState<'default' | 'percentage' | 'name'>('default');

  // Compute Global Metrics dynamically
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const totalLimit = budgets.reduce((acc, b) => acc + b.limit, 0);
  const percentageConsumed = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
  const remainingBudget = Math.max(0, totalLimit - totalSpent);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  // Filtered and sorted budgets
  const filteredBudgets = budgets.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedBudgets = [...filteredBudgets].sort((a, b) => {
    if (sortOrder === 'percentage') {
      const pctA = a.limit > 0 ? a.spent / a.limit : 0;
      const pctB = b.limit > 0 ? b.spent / b.limit : 0;
      return pctB - pctA;
    }
    if (sortOrder === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0; // default order
  });

  const toggleSort = () => {
    if (sortOrder === 'default') setSortOrder('percentage');
    else if (sortOrder === 'percentage') setSortOrder('name');
    else setSortOrder('default');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* PAGE HEADER & ACTIONS BAR */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-label-caps text-[#c0c1ff] uppercase tracking-wider font-semibold">
              PLANEJAMENTO FINANCEIRO
            </span>
            <span className="w-1 h-1 rounded-full bg-[#464554]" />
            <span className="text-label-caps text-[#908fa0] font-medium">
              {selectedPeriod || 'Março 2025'}
            </span>
          </div>
          <h1 className="text-headline-lg font-bold text-[#dae2fd] tracking-tight">
            Orçamentos &amp; Metas Financeiras
          </h1>
          <p className="text-body-md text-[#c7c4d7]">
            Monitore o teto de gastos familiar e acompanhe a evolução do patrimônio de longo prazo.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={onOpenNewTransaction || onOpenNewBudgetModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#222a3d] hover:bg-[#171f33] border border-[#464554]/40 text-[#dae2fd] text-body-md font-medium transition-all active:scale-[0.98] cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] text-[#c0c1ff]">
              add_circle
            </span>
            <span>Lançamento gastos</span>
          </button>
        </div>
      </section>

      {/* RESUMO: TOTAL RECEITA & TOTAL GASTO */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Total receita */}
        <div className="rounded-xl bg-[#131b2e] border border-[#464554]/30 p-6 flex flex-col justify-between hover:border-[#464554]/60 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-label-caps text-[#908fa0] tracking-wider font-semibold">
              TOTAL RECEITA
            </span>
            <div className="w-10 h-10 rounded-lg bg-[#00a572]/20 border border-[#4edea3]/30 flex items-center justify-center text-[#4edea3]">
              <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
            </div>
          </div>
          <div className="my-3">
            <span className="text-display-md text-[#4edea3] font-bold tracking-tight">
              {formatCurrency(totalIncome)}
            </span>
          </div>
          <div className="pt-3 border-t border-[#464554]/20 flex items-center justify-between text-body-sm text-[#908fa0]">
            <span>Entradas no período</span>
            <span className="text-[#4edea3] font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              Recebido no mês
            </span>
          </div>
        </div>

        {/* Card 2: Total gasto */}
        <div className="rounded-xl bg-[#131b2e] border border-[#464554]/30 p-6 flex flex-col justify-between hover:border-[#464554]/60 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-label-caps text-[#908fa0] tracking-wider font-semibold">
              TOTAL GASTO
            </span>
            <div className="w-10 h-10 rounded-lg bg-[#93000a]/20 border border-[#ff516a]/30 flex items-center justify-center text-[#ff516a]">
              <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-2 flex-wrap">
            <span className="text-display-md text-[#dae2fd] font-bold tracking-tight">
              {formatCurrency(totalSpent)}
            </span>
            <span className="text-headline-md text-[#908fa0] font-normal">
              / {formatCurrency(totalLimit)}
            </span>
          </div>
          <div className="pt-3 border-t border-[#464554]/20 flex items-center justify-between text-body-sm text-[#908fa0]">
            <span className="font-medium text-[#dae2fd]">
              {formatPercentage(percentageConsumed)} consumido
            </span>
            <span
              className={`font-semibold ${
                remainingBudget > 0 ? 'text-[#4edea3]' : 'text-[#ff516a]'
              }`}
            >
              {remainingBudget > 0
                ? `${formatCurrency(remainingBudget)} restante`
                : `Estouro: ${formatCurrency(Math.abs(totalLimit - totalSpent))}`}
            </span>
          </div>
        </div>
      </section>

      {/* ORÇAMENTOS POR CATEGORIA (GRID CARDS) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c0c1ff]">category</span>
            <h2 className="text-headline-md text-[#dae2fd] font-semibold">
              Orçamentos por Categoria
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#222a3d] text-body-sm text-[#908fa0]">
              {sortedBudgets.length} ativas
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSort}
              className="text-body-sm text-[#c0c1ff] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>
                {sortOrder === 'default'
                  ? 'Reordenar'
                  : sortOrder === 'percentage'
                  ? 'Por % Gasto'
                  : 'Alfabética'}
              </span>
              <span className="material-symbols-outlined text-[16px]">sort</span>
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedBudgets.map((category) => {
            const pct = category.limit > 0 ? (category.spent / category.limit) * 100 : 0;
            const isExceeded = pct > 100;
            const diff = category.limit - category.spent;

            // Determine badge styles based on category values
            let badgeBg = 'bg-[#2d3449] text-[#c0c1ff] border-[#464554]/30';
            let barColor = 'bg-[#c0c1ff]';
            let iconColor = 'text-[#c0c1ff]';

            if (category.statusType === 'exceeded' || isExceeded) {
              badgeBg = 'bg-[#93000a] text-[#ffb2b7] border-[#ff516a]';
              barColor = 'bg-[#ff516a]';
              iconColor = 'text-[#ffb2b7]';
            } else if (category.statusType === 'critical' || pct >= 95) {
              badgeBg = 'bg-[#ff516a]/20 text-[#ffb2b7] border-[#ff516a]/40';
              barColor = 'bg-[#ffb2b7]';
              iconColor = 'text-[#c0c1ff]';
            } else if (category.statusType === 'healthy') {
              badgeBg = 'bg-[#4edea3]/15 text-[#4edea3] border-[#4edea3]/30';
              barColor = 'bg-[#4edea3]';
              iconColor = 'text-[#4edea3]';
            } else if (category.statusType === 'warning') {
              badgeBg = 'bg-[#2d3449] text-[#ffb2b7] border-[#464554]/30';
              barColor = 'bg-[#c0c1ff]';
              iconColor = 'text-[#c0c1ff]';
            }

            return (
              <div
                key={category.id}
                onClick={() => onEditBudget(category)}
                className={`rounded-xl bg-[#131b2e] border transition-all duration-200 p-5 cursor-pointer relative overflow-hidden group hover:border-[#908fa0] hover:bg-[#171f33] ${
                  isExceeded
                    ? 'border-[#ff516a]/50 shadow-[0_0_15px_rgba(255,81,106,0.15)]'
                    : 'border-[#464554]/30'
                }`}
              >
                {/* Visual overflow glow if exceeded */}
                {isExceeded && (
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#ff516a]/10 rounded-full blur-xl pointer-events-none" />
                )}

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center border border-[#464554]/30 ${
                        isExceeded ? 'bg-[#ff516a]/20 text-[#ffb2b7]' : 'bg-[#222a3d] ' + iconColor
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {category.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-body-lg font-semibold text-[#dae2fd] group-hover:text-white transition-colors">
                        {category.name}
                      </h3>
                      <span className="text-body-sm text-[#908fa0]">{category.subtitle}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-label-caps border font-semibold ${badgeBg}`}
                  >
                    {category.statusBadge}
                  </span>
                </div>

                {/* Amounts: Gasto vs Limite */}
                <div className="mt-5 flex items-baseline justify-between">
                  <div>
                    <span
                      className={`text-label-caps block ${
                        isExceeded ? 'text-[#ffb2b7]' : 'text-[#908fa0]'
                      }`}
                    >
                      {isExceeded ? 'GASTO TOTAL' : 'GASTO'}
                    </span>
                    <span
                      className={`text-tabular-numeric-lg font-semibold ${
                        isExceeded ? 'text-[#ffb2b7] font-bold' : 'text-[#dae2fd]'
                      }`}
                    >
                      R$ {category.spent.toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-label-caps text-[#908fa0] block">LIMITE</span>
                    <span className="text-tabular-numeric-md text-[#908fa0]">
                      R$ {category.limit.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 w-full h-2 rounded-full bg-[#2d3449] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>

                {/* Bottom Card Footer */}
                <div className="mt-3 pt-3 border-t border-[#464554]/20 flex items-center justify-between text-body-sm">
                  {isExceeded ? (
                    <>
                      <span className="text-[#ffb2b7] font-medium">Estouro de orçamento</span>
                      <span className="text-tabular-numeric-md text-[#ffb2b7] font-bold">
                        + {formatCurrency(Math.abs(diff))}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[#908fa0]">Saldo restante</span>
                      <span
                        className={`text-tabular-numeric-md font-medium ${
                          pct >= 95 ? 'text-[#ffb2b7]' : 'text-[#4edea3]'
                        }`}
                      >
                        {formatCurrency(diff)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
