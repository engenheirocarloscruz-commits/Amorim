import React from 'react';
import { NavigationTab } from '../types';

interface SideNavProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenNewTransaction: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewTransaction,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard Geral', icon: 'dashboard' },
    { id: 'budgets', label: 'Orçamentos & Metas', icon: 'pie_chart' },
    { id: 'transactions', label: 'Lançamentos', icon: 'receipt_long' },
    { id: 'accounts', label: 'Contas & Cartões', icon: 'account_balance_wallet' },
    { id: 'settings', label: 'Configurações', icon: 'settings' },
    { id: 'support', label: 'Ajuda & Suporte', icon: 'help_outline' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Side Nav Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 z-50 bg-[#131b2e] border-r border-[#464554]/30 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out lg:static lg:h-screen lg:sticky lg:top-0 lg:translate-x-0 lg:shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Header */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2d3449] flex items-center justify-center border border-[#464554]/30 text-[#c0c1ff] shadow-inner">
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                  account_balance
                </span>
              </div>
              <div>
                <div className="text-headline-md font-bold text-[#dae2fd] tracking-tight leading-tight">
                  WealthFlow
                </div>
                <div className="text-body-sm text-[#908fa0] leading-tight">
                  Gestão Doméstica
                </div>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-[#908fa0] hover:text-[#dae2fd] p-1 rounded-md"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Action Button: Novo Lançamento */}
          <button
            onClick={() => {
              onOpenNewTransaction();
              if (isMobileOpen) onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#8083ff] hover:bg-[#494bd6] text-[#0d0096] hover:text-white py-2.5 px-4 rounded-lg font-body-md font-semibold shadow-md shadow-[#8083ff]/20 transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>Novo Lançamento</span>
          </button>

          {/* Primary Navigation Tabs */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (isMobileOpen) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-150 active:scale-[0.98] cursor-pointer ${
                    isActive
                      ? 'bg-[#222a3d] text-[#c0c1ff] font-medium border-l-2 border-[#c0c1ff]'
                      : 'text-[#c7c4d7] hover:bg-[#171f33] hover:text-[#dae2fd] font-normal'
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span className="text-body-md">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};
