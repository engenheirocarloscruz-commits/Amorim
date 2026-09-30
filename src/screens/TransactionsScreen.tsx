import React, { useState } from 'react';
import { Transaction, BudgetCategory } from '../types';
import { formatCurrency } from '../utils/formatters';

interface TransactionsScreenProps {
  transactions: Transaction[];
  budgets: BudgetCategory[];
  onOpenNewTransaction: () => void;
  onDeleteTransaction: (id: string) => void;
  searchTerm?: string;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({
  transactions,
  budgets,
  onOpenNewTransaction,
  onDeleteTransaction,
  searchTerm: externalSearch = '',
}) => {
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income' | 'investment'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState('');

  const activeSearch = (externalSearch || localSearch).toLowerCase();

  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesCat = selectedCategory === 'all' || tx.category === selectedCategory;
    const matchesSearch =
      tx.description.toLowerCase().includes(activeSearch) ||
      tx.category.toLowerCase().includes(activeSearch) ||
      tx.account.toLowerCase().includes(activeSearch);
    return matchesType && matchesCat && matchesSearch;
  });

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalInvested = transactions
    .filter((t) => t.type === 'investment')
    .reduce((acc, t) => acc + t.amount, 0);

  const exportCSV = () => {
    const headers = ['Data', 'Descricao', 'Categoria', 'Conta', 'Metodo', 'Tipo', 'Valor'];
    const rows = filteredTransactions.map((t) => [
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      `"${t.account}"`,
      `"${t.paymentMethod}"`,
      t.type,
      t.amount.toFixed(2),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wealthflow_extrato_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-label-caps text-[#c0c1ff] uppercase tracking-wider font-semibold">
              EXTRATO DETALHADO
            </span>
            <span className="w-1 h-1 rounded-full bg-[#464554]" />
            <span className="text-label-caps text-[#908fa0]">Março 2025</span>
          </div>
          <h1 className="text-headline-lg font-bold text-[#dae2fd] tracking-tight">
            Extrato &amp; Lançamentos
          </h1>
          <p className="text-body-md text-[#c7c4d7]">
            Registro de todas as entradas, saídas e movimentações patrimoniais.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#171f33] hover:bg-[#222a3d] border border-[#464554]/40 text-[#dae2fd] text-body-md transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8083ff] hover:bg-[#494bd6] text-[#0d0096] hover:text-white font-semibold text-body-md transition-all shadow-md active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Novo Lançamento</span>
          </button>
        </div>
      </section>

      {/* Metric Cards Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#464554]/30">
          <span className="text-label-caps text-[#908fa0]">TOTAL DE ENTRADAS</span>
          <div className="mt-1 text-headline-lg font-bold text-[#4edea3]">
            {formatCurrency(totalIncome)}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#464554]/30">
          <span className="text-label-caps text-[#908fa0]">TOTAL DE SAÍDAS (GASTOS)</span>
          <div className="mt-1 text-headline-lg font-bold text-[#ffb2b7]">
            {formatCurrency(totalExpense)}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#464554]/30">
          <span className="text-label-caps text-[#908fa0]">APORTES EM INVESTIMENTOS</span>
          <div className="mt-1 text-headline-lg font-bold text-[#c0c1ff]">
            {formatCurrency(totalInvested)}
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="p-4 rounded-xl bg-[#131b2e] border border-[#464554]/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0b1326] border border-[#464554]/30 overflow-x-auto">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'expense', label: 'Despesas' },
            { id: 'income', label: 'Receitas' },
            { id: 'investment', label: 'Investimentos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 rounded-md text-body-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-[#222a3d] text-[#c0c1ff] shadow-sm'
                  : 'text-[#908fa0] hover:text-[#dae2fd]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Dropdown & Quick Search */}
        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 px-3 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-sm focus:outline-none focus:border-[#c0c1ff]"
          >
            <option value="all">Todas as Categorias</option>
            {budgets.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
            <option value="Renda & Proventos">Renda & Proventos</option>
            <option value="Investimentos">Investimentos</option>
          </select>

          <input
            type="text"
            placeholder="Filtrar por texto..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="h-9 px-3 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-sm placeholder:text-[#908fa0] focus:outline-none focus:border-[#c0c1ff] w-44"
          />
        </div>
      </section>

      {/* Transactions Table */}
      <section className="rounded-xl bg-[#131b2e] border border-[#464554]/30 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#464554]/30 bg-[#060e20]/60 text-label-caps text-[#908fa0]">
                <th className="py-3 px-5 font-semibold">DESCRIÇÃO</th>
                <th className="py-3 px-4 font-semibold">CATEGORIA</th>
                <th className="py-3 px-4 font-semibold">CONTA / CARTÃO</th>
                <th className="py-3 px-4 font-semibold">MÉTODO</th>
                <th className="py-3 px-4 font-semibold">DATA</th>
                <th className="py-3 px-4 font-semibold text-right">VALOR</th>
                <th className="py-3 px-5 font-semibold text-center">AÇÃO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#464554]/20 text-body-sm">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#908fa0]">
                    Nenhum lançamento encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#171f33] transition-colors group">
                    <td className="py-3.5 px-5 font-medium text-[#dae2fd]">
                      {tx.description}
                    </td>
                    <td className="py-3.5 px-4 text-[#c7c4d7]">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#222a3d] text-[12px] border border-[#464554]/30">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#908fa0]">{tx.account}</td>
                    <td className="py-3.5 px-4 text-[#908fa0]">{tx.paymentMethod}</td>
                    <td className="py-3.5 px-4 text-[#908fa0] whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td
                      className={`py-3.5 px-4 text-right font-tabular-numeric-md font-semibold whitespace-nowrap ${
                        tx.type === 'income'
                          ? 'text-[#4edea3]'
                          : tx.type === 'investment'
                          ? 'text-[#c0c1ff]'
                          : 'text-[#ffb2b7]'
                      }`}
                    >
                      {tx.type === 'income' ? '+ ' : '- '}
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="text-[#908fa0] hover:text-[#ff516a] p-1 rounded transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
                        title="Remover lançamento"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
