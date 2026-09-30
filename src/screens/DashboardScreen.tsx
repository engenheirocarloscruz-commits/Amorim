import React, { useState, useMemo } from 'react';
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

const MONTHS_DATA = [
  { num: '01', short: 'Jan', full: 'Janeiro' },
  { num: '02', short: 'Fev', full: 'Fevereiro' },
  { num: '03', short: 'Mar', full: 'Março' },
  { num: '04', short: 'Abr', full: 'Abril' },
  { num: '05', short: 'Mai', full: 'Maio' },
  { num: '06', short: 'Jun', full: 'Junho' },
  { num: '07', short: 'Jul', full: 'Julho' },
  { num: '08', short: 'Ago', full: 'Agosto' },
  { num: '09', short: 'Set', full: 'Setembro' },
  { num: '10', short: 'Out', full: 'Outubro' },
  { num: '11', short: 'Nov', full: 'Novembro' },
  { num: '12', short: 'Dez', full: 'Dezembro' },
];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  budgets,
  transactions,
  selectedPeriod,
  onOpenNewTransaction,
}) => {
  const currentYear = new Date().getFullYear();
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  // Compute expenses for each of the 12 months
  const monthlyExpenses = useMemo(() => {
    return MONTHS_DATA.map((m) => {
      const monthExpenses = transactions
        .filter((t) => {
          if (t.type !== 'expense' || !t.date) return false;
          const [y, month] = t.date.split('-');
          return (parseInt(y, 10) === currentYear || !y) && month === m.num;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        ...m,
        amount: monthExpenses,
      };
    });
  }, [transactions, currentYear]);

  const maxMonthExpense = useMemo(() => {
    return Math.max(...monthlyExpenses.map((m) => m.amount), 0);
  }, [monthlyExpenses]);

  const totalAnnualExpenses = useMemo(() => {
    return monthlyExpenses.reduce((sum, m) => sum + m.amount, 0);
  }, [monthlyExpenses]);

  const activeMonthsCount = monthlyExpenses.filter((m) => m.amount > 0).length;
  const avgMonthlyExpense = activeMonthsCount > 0 ? totalAnnualExpenses / activeMonthsCount : 0;

  const highestMonth = useMemo(() => {
    if (maxMonthExpense === 0) return null;
    return monthlyExpenses.find((m) => m.amount === maxMonthExpense) || null;
  }, [monthlyExpenses, maxMonthExpense]);

  const displayMonth = selectedPeriod ? selectedPeriod.replace(/\s*\d{4}/g, '').trim() : 'Geral';

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
            Acompanhamento simplificado de receitas, despesas e comparativo anual em Euro (€).
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
            <span>Entradas acumuladas</span>
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

      {/* Gráfico de Barras com comparativo de despesas de todos os meses do ano */}
      <section className="rounded-xl bg-[#131b2e] border border-[#464554]/30 p-6 shadow-sm flex flex-col gap-6">
        {/* Header do Gráfico */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#464554]/25">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#8083ff]/15 border border-[#8083ff]/30 flex items-center justify-center text-[#8083ff]">
              <span className="material-symbols-outlined text-[22px]">leaderboard</span>
            </div>
            <div>
              <h2 className="text-headline-md font-bold text-[#dae2fd]">
                Comparativo Mensal de Despesas
              </h2>
              <p className="text-body-sm text-[#908fa0]">
                Evolução comparativa dos gastos em todos os meses do ano em Euro (€)
              </p>
            </div>
          </div>
        </div>

        {/* Resumo Rápido do Comparativo Anual */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#0b1326]/60 border border-[#464554]/30">
          <div>
            <div className="text-[12px] uppercase tracking-wider text-[#908fa0] font-semibold">
              Total Despesas no Ano
            </div>
            <div className="text-headline-sm font-bold text-[#dae2fd] mt-1 font-tabular-numeric">
              {formatCurrency(totalAnnualExpenses)}
            </div>
          </div>

          <div>
            <div className="text-[12px] uppercase tracking-wider text-[#908fa0] font-semibold">
              Média Mensal
            </div>
            <div className="text-headline-sm font-bold text-[#c0c1ff] mt-1 font-tabular-numeric">
              {formatCurrency(avgMonthlyExpense)}
            </div>
          </div>

          <div>
            <div className="text-[12px] uppercase tracking-wider text-[#908fa0] font-semibold">
              Mês Mais Alto
            </div>
            <div className="text-headline-sm font-bold text-[#ffb2b7] mt-1 truncate">
              {highestMonth ? `${highestMonth.full} (${formatCurrency(highestMonth.amount)})` : 'Sem despesas'}
            </div>
          </div>
        </div>

        {/* Gráfico de Barras Verticais */}
        <div className="w-full pt-4">
          <div className="overflow-x-auto pb-2 scrollbar-thin">
            <div className="min-w-[680px] h-64 flex flex-col justify-end">
              {/* Linhas de grade e barras */}
              <div className="relative flex-1 flex items-end justify-between gap-3 px-2 border-b border-[#464554]/40">
                {/* Linhas guia de referência */}
                <div className="absolute inset-x-0 top-0 border-t border-[#464554]/15 pointer-events-none" />
                <div className="absolute inset-x-0 top-1/2 border-t border-[#464554]/15 pointer-events-none" />

                {monthlyExpenses.map((m) => {
                  const heightPercent =
                    maxMonthExpense > 0 && m.amount > 0
                      ? Math.max(8, Math.round((m.amount / maxMonthExpense) * 100))
                      : 0;
                  const isHovered = hoveredMonth === m.num;
                  const isHighest = highestMonth?.num === m.num && m.amount > 0;

                  return (
                    <div
                      key={m.num}
                      onMouseEnter={() => setHoveredMonth(m.num)}
                      onMouseLeave={() => setHoveredMonth(null)}
                      className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                    >
                      {/* Tooltip no Hover */}
                      {isHovered && (
                        <div className="absolute -top-12 z-20 px-2.5 py-1.5 rounded-lg bg-[#0b1326] border border-[#8083ff]/50 shadow-xl text-center whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                          <div className="text-[11px] font-semibold text-[#c0c1ff]">{m.full}</div>
                          <div className="text-[12px] font-bold text-[#dae2fd]">
                            {formatCurrency(m.amount)}
                          </div>
                          {totalAnnualExpenses > 0 && (
                            <div className="text-[10px] text-[#908fa0]">
                              {formatPercentage((m.amount / totalAnnualExpenses) * 100)} do ano
                            </div>
                          )}
                        </div>
                      )}

                      {/* Valor acima da barra */}
                      <span
                        className={`text-[11px] font-medium mb-1.5 transition-colors font-tabular-numeric ${
                          m.amount > 0 ? 'text-[#c0c1ff]' : 'text-transparent group-hover:text-[#908fa0]'
                        }`}
                      >
                        {m.amount > 0 ? formatCurrency(m.amount).replace(',00', '') : '0 €'}
                      </span>

                      {/* Coluna da Barra */}
                      <div className="w-full max-w-[42px] flex items-end justify-center h-44 rounded-t-lg bg-[#0b1326]/40 p-0.5">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-md transition-all duration-500 ease-out ${
                            isHighest
                              ? 'bg-gradient-to-t from-[#ff516a] to-[#ff8f9f] shadow-lg shadow-[#ff516a]/20'
                              : m.amount > 0
                              ? 'bg-gradient-to-t from-[#8083ff] to-[#c0c1ff] group-hover:from-[#494bd6] group-hover:to-[#8083ff]'
                              : 'h-1 bg-[#464554]/30'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rótulos dos Meses no Eixo X */}
              <div className="flex items-center justify-between gap-3 px-2 pt-3">
                {monthlyExpenses.map((m) => (
                  <div
                    key={m.num}
                    className={`flex-1 text-center text-body-sm transition-colors ${
                      hoveredMonth === m.num
                        ? 'text-[#8083ff] font-bold'
                        : 'text-[#908fa0] font-medium'
                    }`}
                  >
                    {m.short}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legenda e Ajuda */}
          <div className="mt-4 pt-3 border-t border-[#464554]/20 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#908fa0]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-[#8083ff] to-[#c0c1ff]" />
                Despesas Mensais
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-[#ff516a] to-[#ff8f9f]" />
                Mês com Maior Gasto
              </span>
            </div>
            <span>Passe o cursor sobre cada mês para ver detalhes e percentuais</span>
          </div>
        </div>
      </section>
    </div>
  );
};
