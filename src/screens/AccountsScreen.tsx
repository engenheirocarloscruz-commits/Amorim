import React, { useState } from 'react';
import { FinancialAccount } from '../types';
import { formatCurrency } from '../utils/formatters';

interface AccountsScreenProps {
  accounts: FinancialAccount[];
  onAddAccount: (account: Partial<FinancialAccount>) => void;
}

export const AccountsScreen: React.FC<AccountsScreenProps> = ({ accounts }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccInst, setNewAccInst] = useState('');
  const [newAccBalance, setNewAccBalance] = useState('');
  const [newAccType, setNewAccType] = useState<'checking' | 'credit' | 'investment'>('checking');

  const totalChecking = accounts
    .filter((a) => a.type === 'checking')
    .reduce((acc, a) => acc + a.balance, 0);
  const totalInvestment = accounts
    .filter((a) => a.type === 'investment')
    .reduce((acc, a) => acc + a.balance, 0);
  const totalCreditUsed = accounts
    .filter((a) => a.type === 'credit')
    .reduce((acc, a) => acc + Math.abs(a.balance), 0);
  const totalCreditLimit = accounts
    .filter((a) => a.type === 'credit' && a.limit)
    .reduce((acc, a) => acc + (a.limit || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-label-caps text-[#c0c1ff] uppercase tracking-wider font-semibold">
              INSTITUIÇÕES & MEIOS DE PAGAMENTO
            </span>
            <span className="w-1 h-1 rounded-full bg-[#464554]" />
            <span className="text-label-caps text-[#908fa0]">Contas Ativas</span>
          </div>
          <h1 className="text-headline-lg font-bold text-[#dae2fd] tracking-tight">
            Contas &amp; Cartões
          </h1>
          <p className="text-body-md text-[#c7c4d7]">
            Gerenciamento integrado de saldos bancários, limites de cartões e custódia de investimentos.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8083ff] hover:bg-[#494bd6] text-[#0d0096] hover:text-white font-semibold text-body-md transition-all shadow-md active:scale-[0.98] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Adicionar Conta / Cartão</span>
        </button>
      </section>

      {/* Summary KPI Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#131b2e] border border-[#464554]/30">
          <div className="flex items-center justify-between text-[#908fa0]">
            <span className="text-label-caps">SALDO EM CONTA CORRENTE</span>
            <span className="material-symbols-outlined text-[#4edea3]">account_balance</span>
          </div>
          <div className="mt-2 text-headline-lg font-bold text-[#dae2fd]">
            {formatCurrency(totalChecking)}
          </div>
          <div className="mt-1 text-body-sm text-[#4edea3]">Disponibilidade imediata</div>
        </div>

        <div className="p-5 rounded-xl bg-[#131b2e] border border-[#464554]/30">
          <div className="flex items-center justify-between text-[#908fa0]">
            <span className="text-label-caps">CARTEIRA DE INVESTIMENTOS</span>
            <span className="material-symbols-outlined text-[#c0c1ff]">trending_up</span>
          </div>
          <div className="mt-2 text-headline-lg font-bold text-[#dae2fd]">
            {formatCurrency(totalInvestment)}
          </div>
          <div className="mt-1 text-body-sm text-[#908fa0]">Tesouro, FIIs e Renda Fixa</div>
        </div>

        <div className="p-5 rounded-xl bg-[#131b2e] border border-[#464554]/30">
          <div className="flex items-center justify-between text-[#908fa0]">
            <span className="text-label-caps">FATURA ATUAL DE CARTÕES</span>
            <span className="material-symbols-outlined text-[#ff516a]">credit_card</span>
          </div>
          <div className="mt-2 text-headline-lg font-bold text-[#ffb2b7]">
            {formatCurrency(totalCreditUsed)}
          </div>
          <div className="mt-1 text-body-sm text-[#908fa0]">
            Limite global: {formatCurrency(totalCreditLimit)}
          </div>
        </div>
      </section>

      {/* Virtual Credit Cards Showcase */}
      <section className="flex flex-col gap-4">
        <h2 className="text-headline-md font-semibold text-[#dae2fd]">
          Cartões de Crédito da Família
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts
            .filter((a) => a.type === 'credit')
            .map((card) => {
              const used = Math.abs(card.balance);
              const limit = card.limit || 1;
              const pct = (used / limit) * 100;
              return (
                <div
                  key={card.id}
                  className="rounded-2xl bg-gradient-to-br from-[#1c1936] to-[#0f1026] border border-[#8083ff]/40 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group min-h-[220px]"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#8083ff]/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-body-sm text-[#c0c1ff] font-medium tracking-wide">
                        {card.institution}
                      </span>
                      <h3 className="text-headline-md font-bold text-white mt-0.5">
                        {card.name}
                      </h3>
                    </div>
                    {/* Chip Graphic */}
                    <div className="w-11 h-8 rounded-md bg-amber-400/80 border border-amber-300 shadow-inner flex items-center justify-center">
                      <div className="w-7 h-5 border border-amber-900/40 rounded-sm" />
                    </div>
                  </div>

                  <div className="my-4">
                    <div className="text-label-caps text-[#c7c4d7]/70">Fatura Fechando dia {card.closingDay || 26}</div>
                    <div className="text-display-md text-white font-bold tracking-tight">
                      {formatCurrency(used)}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-body-sm text-[#c7c4d7] mb-1.5">
                      <span>Limite utilizado ({pct.toFixed(0)}%)</span>
                      <span className="text-white font-medium">Disp: {formatCurrency(card.availableLimit || 0)}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#4edea3] to-[#ff516a] rounded-full"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-body-sm text-[#908fa0] mt-3">
                      <span>•••• •••• •••• {card.cardLastDigits || '8942'}</span>
                      <span className="font-semibold text-white">Mastercard Black</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* Bank & Broker Accounts List */}
      <section className="flex flex-col gap-4">
        <h2 className="text-headline-md font-semibold text-[#dae2fd]">
          Contas Bancárias e Corretoras
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts
            .filter((a) => a.type !== 'credit')
            .map((acc) => (
              <div
                key={acc.id}
                className="p-5 rounded-xl bg-[#131b2e] border border-[#464554]/30 flex items-center justify-between hover:border-[#908fa0] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#222a3d] border border-[#464554]/30 flex items-center justify-center text-[#c0c1ff]">
                    <span className="material-symbols-outlined text-[24px]">
                      {acc.type === 'investment' ? 'show_chart' : 'account_balance'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-body-lg font-semibold text-[#dae2fd]">
                      {acc.name}
                    </h3>
                    <p className="text-body-sm text-[#908fa0]">
                      {acc.institution} • {acc.type === 'investment' ? 'Conta Investimento' : 'Conta Corrente'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-label-caps text-[#908fa0] block">SALDO ATUAL</span>
                  <span className="text-headline-md font-bold text-[#dae2fd]">
                    {formatCurrency(acc.balance)}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#131b2e] border border-[#464554]/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#464554]/30">
              <h3 className="text-headline-md font-bold text-[#dae2fd]">
                Adicionar Conta ou Cartão
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#908fa0] hover:text-[#dae2fd]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 my-4">
              <div>
                <label className="text-label-caps text-[#908fa0] block mb-1">
                  NOME DA CONTA / CARTÃO
                </label>
                <input
                  type="text"
                  placeholder="Ex: Santander Select, Inter Black..."
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-md focus:outline-none focus:border-[#c0c1ff]"
                />
              </div>

              <div>
                <label className="text-label-caps text-[#908fa0] block mb-1">
                  INSTITUIÇÃO FINANCEIRA
                </label>
                <input
                  type="text"
                  placeholder="Ex: Santander, BTG Pactual, Inter"
                  value={newAccInst}
                  onChange={(e) => setNewAccInst(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-md focus:outline-none focus:border-[#c0c1ff]"
                />
              </div>

              <div>
                <label className="text-label-caps text-[#908fa0] block mb-1">
                  TIPO DE CONTA
                </label>
                <select
                  value={newAccType}
                  onChange={(e) => setNewAccType(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-md focus:outline-none focus:border-[#c0c1ff]"
                >
                  <option value="checking">Conta Corrente</option>
                  <option value="credit">Cartão de Crédito</option>
                  <option value="investment">Conta de Investimentos</option>
                </select>
              </div>

              <div>
                <label className="text-label-caps text-[#908fa0] block mb-1">
                  SALDO INICIAL OU FATURA (R$)
                </label>
                <input
                  type="number"
                  placeholder="0,00"
                  value={newAccBalance}
                  onChange={(e) => setNewAccBalance(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-md focus:outline-none focus:border-[#c0c1ff]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#464554]/30">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg text-body-md text-[#908fa0] hover:text-[#dae2fd]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!newAccName) return;
                  setShowAddModal(false);
                  setNewAccName('');
                }}
                className="px-4 py-2 rounded-lg bg-[#c0c1ff] text-[#1000a9] font-semibold text-body-md hover:bg-[#a5a7ff]"
              >
                Salvar Conta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
