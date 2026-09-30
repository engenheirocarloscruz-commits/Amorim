import React, { useState } from 'react';
import { BudgetCategory, FinancialGoal, Transaction, FinancialAccount } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface DashboardScreenProps {
  budgets: BudgetCategory[];
  goals?: FinancialGoal[];
  transactions: Transaction[];
  accounts?: FinancialAccount[];
  selectedPeriod?: string;
  onNavigateToTab?: (tab: any) => void;
  onOpenNewTransaction: () => void;
}

const CATEGORY_STYLES: Record<string, { gradient: string; text: string; bg: string; border: string }> = {
  'Moradia & Contas': {
    gradient: 'from-[#8083ff] to-[#a5a7ff]',
    text: '#c0c1ff',
    bg: 'bg-[#8083ff]/15',
    border: 'border-[#8083ff]/30',
  },
  'Alimentação & Mercado': {
    gradient: 'from-[#4edea3] to-[#7bf2bd]',
    text: '#4edea3',
    bg: 'bg-[#4edea3]/15',
    border: 'border-[#4edea3]/30',
  },
  'Lazer & Restaurantes': {
    gradient: 'from-[#ff516a] to-[#ff8f9f]',
    text: '#ffb2b7',
    bg: 'bg-[#ff516a]/15',
    border: 'border-[#ff516a]/30',
  },
  'Compras Pessoais': {
    gradient: 'from-[#c0c1ff] to-[#dae2fd]',
    text: '#c0c1ff',
    bg: 'bg-[#c0c1ff]/15',
    border: 'border-[#c0c1ff]/30',
  },
  'Transporte & Combustível': {
    gradient: 'from-[#ffb86c] to-[#ffd199]',
    text: '#ffb86c',
    bg: 'bg-[#ffb86c]/15',
    border: 'border-[#ffb86c]/30',
  },
  'Saúde & Cuidados': {
    gradient: 'from-[#38bdf8] to-[#7dd3fc]',
    text: '#38bdf8',
    bg: 'bg-[#38bdf8]/15',
    border: 'border-[#38bdf8]/30',
  },
};

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  budgets,
  transactions,
  selectedPeriod,
  onOpenNewTransaction,
}) => {
  const [sortBy, setSortBy] = useState<'amount' | 'percentage' | 'name'>('amount');

  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0) || 14500;

  // Sort expense categories
  const sortedExpenses = [...budgets].sort((a, b) => {
    if (sortBy === 'amount') return b.spent - a.spent;
    if (sortBy === 'percentage') return (b.spent / (b.limit || 1)) - (a.spent / (a.limit || 1));
    return a.name.localeCompare(b.name);
  });

  const maxExpense = Math.max(...sortedExpenses.map((e) => e.spent), 1);
  const displayMonth = selectedPeriod ? selectedPeriod.replace(/\s*\d{4}/g, '').trim() : 'Março';

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner / Welcome */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-label-caps text-[#c0c1ff] uppercase tracking-wider font-semibold">
              VISÃO CONSOLIDADA
            </span>
            <span className="w-1 h-1 rounded-full bg-[#464554]" />
            <span className="text-label-caps text-[#908fa0]">{displayMonth}</span>
          </div>
          <h1 className="text-headline-lg font-bold text-[#dae2fd] tracking-tight">
            Dashboard Geral
          </h1>
          <p className="text-body-md text-[#c7c4d7]">
            Acompanhamento simplificado de receitas, despesas e distribuição de gastos em Euro (€).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8083ff] hover:bg-[#494bd6] text-[#0d0096] hover:text-white font-semibold text-body-md transition-all shadow-md active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Novo Lançamento</span>
          </button>
        </div>
      </section>

      {/* 2 Stat Cards: Receita & Despesas */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Receita */}
        <div className="rounded-xl bg-[#131b2e] border border-[#464554]/30 p-6 flex flex-col justify-between hover:border-[#464554]/60 transition-colors shadow-sm">
          <div className="flex items-center justify-between text-[#908fa0]">
            <span className="text-label-caps font-semibold text-[#908fa0] tracking-wider uppercase">
              RECEITA
            </span>
            <div className="w-10 h-10 rounded-lg bg-[#00a572]/20 border border-[#4edea3]/30 flex items-center justify-center text-[#4edea3]">
              <span className="material-symbols-outlined text-[22px]">arrow_downward</span>
            </div>
          </div>
          <div className="my-4">
            <span className="text-display-md text-[#4edea3] font-bold tracking-tight">
              {formatCurrency(totalIncome)}
            </span>
          </div>
          <div className="pt-3 border-t border-[#464554]/20 flex items-center justify-between text-body-sm text-[#908fa0]">
            <span>Entradas no período</span>
            <span className="text-[#4edea3] font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              Recebido
            </span>
          </div>
        </div>

        {/* Card 2: Despesas */}
        <div className="rounded-xl bg-[#131b2e] border border-[#464554]/30 p-6 flex flex-col justify-between hover:border-[#464554]/60 transition-colors shadow-sm">
          <div className="flex items-center justify-between text-[#908fa0]">
            <span className="text-label-caps font-semibold text-[#908fa0] tracking-wider uppercase">
              DESPESAS
            </span>
            <div className="w-10 h-10 rounded-lg bg-[#93000a]/20 border border-[#ff516a]/30 flex items-center justify-center text-[#ff516a]">
              <span className="material-symbols-outlined text-[22px]">arrow_upward</span>
            </div>
          </div>
          <div className="my-4">
            <span className="text-display-md text-[#ffb2b7] font-bold tracking-tight">
              {formatCurrency(totalSpent)}
            </span>
          </div>
          <div className="pt-3 border-t border-[#464554]/20 flex items-center justify-between text-body-sm text-[#908fa0]">
            <span>Gastos executados</span>
            <span className="text-[#ff516a] font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">trending_down</span>
              Total pago
            </span>
          </div>
        </div>
      </section>

      {/* Gráfico de Barras Horizontais por Tipo de Despesa */}
      <section className="rounded-xl bg-[#131b2e] border border-[#464554]/30 p-6 shadow-sm">
        {/* Header do Gráfico com Controles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#464554]/25">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#8083ff]/15 border border-[#8083ff]/30 flex items-center justify-center text-[#8083ff]">
              <span className="material-symbols-outlined text-[22px]">bar_chart</span>
            </div>
            <div>
              <h2 className="text-headline-md font-bold text-[#dae2fd]">
                Despesas por Tipo
              </h2>
              <p className="text-body-sm text-[#908fa0]">
                Gráfico de barras horizontais com a distribuição detalhada dos gastos em Euro (€)
              </p>
            </div>
          </div>

          {/* Filtros de Ordenação */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0b1326] border border-[#464554]/30 self-start sm:self-auto">
            <button
              onClick={() => setSortBy('amount')}
              className={`px-3 py-1.5 rounded-md text-body-sm font-medium transition-colors cursor-pointer ${
                sortBy === 'amount'
                  ? 'bg-[#1e273e] text-[#dae2fd] shadow-sm'
                  : 'text-[#908fa0] hover:text-[#dae2fd]'
              }`}
            >
              Maior Valor
            </button>
            <button
              onClick={() => setSortBy('percentage')}
              className={`px-3 py-1.5 rounded-md text-body-sm font-medium transition-colors cursor-pointer ${
                sortBy === 'percentage'
                  ? 'bg-[#1e273e] text-[#dae2fd] shadow-sm'
                  : 'text-[#908fa0] hover:text-[#dae2fd]'
              }`}
            >
              % do Teto
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-3 py-1.5 rounded-md text-body-sm font-medium transition-colors cursor-pointer ${
                sortBy === 'name'
                  ? 'bg-[#1e273e] text-[#dae2fd] shadow-sm'
                  : 'text-[#908fa0] hover:text-[#dae2fd]'
              }`}
            >
              Nome
            </button>
          </div>
        </div>

        {/* Lista de Barras Horizontais */}
        <div className="py-6 space-y-5">
          {sortedExpenses.map((item) => {
            const style = CATEGORY_STYLES[item.name] || {
              gradient: 'from-[#8083ff] to-[#c0c1ff]',
              text: '#c0c1ff',
              bg: 'bg-[#8083ff]/15',
              border: 'border-[#8083ff]/30',
            };

            const percentageOfTotal = totalSpent > 0 ? (item.spent / totalSpent) * 100 : 0;
            const barWidth = Math.max(5, Math.round((item.spent / maxExpense) * 100));

            return (
              <div
                key={item.id}
                className="group p-3 sm:p-4 rounded-xl hover:bg-[#171f33]/60 transition-all border border-transparent hover:border-[#464554]/20"
              >
                {/* Rótulo superior da barra */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${style.bg} ${style.border} border`}
                    >
                      <span className={`material-symbols-outlined text-[18px]`} style={{ color: style.text }}>
                        {item.icon}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-body-md text-[#dae2fd] truncate block">
                        {item.name}
                      </span>
                      <span className="text-[12px] text-[#908fa0] truncate block">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Valor monetário e percentual do total */}
                  <div className="text-right shrink-0">
                    <div className="font-bold text-headline-sm text-[#dae2fd] font-tabular-numeric">
                      {formatCurrency(item.spent)}
                    </div>
                    <div className="text-[12px] text-[#908fa0]">
                      <span className="font-medium text-[#c0c1ff]">{formatPercentage(percentageOfTotal)}</span> do total de despesas
                    </div>
                  </div>
                </div>

                {/* Barra Horizontal */}
                <div className="relative w-full h-3.5 rounded-full bg-[#0b1326] border border-[#464554]/30 overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${style.gradient} transition-all duration-700 ease-out`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
