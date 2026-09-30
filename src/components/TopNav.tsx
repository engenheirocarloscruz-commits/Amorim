import React, { useState } from 'react';
import { NotificationItem } from '../types';
import { useAuth } from '../firebase/authContext';

interface TopNavProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedPeriod: string;
  onOpenPeriodFilter: () => void;
  onOpenExportReport: () => void;
  onOpenMobileNav: () => void;
  onSaveToCloud?: () => void;
  isSavingCloud?: boolean;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onOpenPreferences?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  searchTerm,
  onSearchChange,
  selectedPeriod,
  onOpenPeriodFilter,
  onOpenExportReport,
  onOpenMobileNav,
  onSaveToCloud,
  isSavingCloud = false,
  notifications,
  onMarkNotificationRead,
}) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 right-0 w-full z-30 bg-[#131b2e]/95 backdrop-blur-md border-b border-[#464554]/30">
      <div className="flex items-center justify-between h-14 px-4 sm:px-6 max-w-[1680px] w-full mx-auto">
        {/* Left Side: Mobile Menu Button & Search */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden p-1.5 rounded-lg text-[#dae2fd] hover:bg-[#171f33]"
            aria-label="Abrir menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          {/* Search Bar */}
          <div className="relative w-48 sm:w-72 md:w-80">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#908fa0] text-[18px]"
              data-icon="search"
            >
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar metas, categorias ou regras..."
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-[#0b1326] text-body-md text-[#dae2fd] placeholder:text-[#908fa0] border border-[#464554]/40 focus:border-[#c0c1ff] focus:ring-1 focus:ring-[#c0c1ff] focus:outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#908fa0] hover:text-[#dae2fd]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Trailing Actions Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Trailing Primary Action: Filtrar Período */}
          <button
            onClick={onOpenPeriodFilter}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#171f33] border border-[#464554]/40 hover:bg-[#222a3d] text-body-md text-[#dae2fd] transition-colors duration-150 active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            <span className="truncate max-w-[110px]">{selectedPeriod || 'Filtrar Período'}</span>
          </button>

          {/* Trailing Secondary Action: Exportar Relatório */}
          <button
            onClick={onOpenExportReport}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#171f33] border border-[#464554]/40 hover:bg-[#222a3d] text-body-md text-[#dae2fd] transition-colors duration-150 active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Exportar Relatório</span>
          </button>

          <div className="hidden sm:block h-5 w-px bg-[#464554]/30 mx-1" />

          {/* Trailing Icon Actions: Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-[#c7c4d7] hover:bg-[#171f33] hover:text-[#dae2fd] transition-colors relative cursor-pointer"
              title="Notificações"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff516a] animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#131b2e] border border-[#464554]/50 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-[#464554]/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      notifications_active
                    </span>
                    <h4 className="text-body-md font-semibold text-[#dae2fd]">Notificações</h4>
                  </div>
                  <span className="text-label-caps text-[#908fa0]">
                    {unreadCount} novas
                  </span>
                </div>

                <div className="divide-y divide-[#464554]/20 max-h-72 overflow-y-auto mt-2">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkNotificationRead(notif.id)}
                      className={`p-2.5 rounded-lg my-1 transition-colors cursor-pointer ${
                        notif.read ? 'opacity-60 hover:bg-[#171f33]' : 'bg-[#171f33] hover:bg-[#222a3d]'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`material-symbols-outlined text-[18px] shrink-0 ${
                            notif.type === 'alert'
                              ? 'text-[#ff516a]'
                              : notif.type === 'success'
                              ? 'text-[#4edea3]'
                              : 'text-[#c0c1ff]'
                          }`}
                        >
                          {notif.type === 'alert'
                            ? 'warning'
                            : notif.type === 'success'
                            ? 'check_circle'
                            : 'info'}
                        </span>
                        <div className="flex-1">
                          <p className="text-body-sm font-semibold text-[#dae2fd]">
                            {notif.title}
                          </p>
                          <p className="text-body-sm text-[#908fa0] mt-0.5">
                            {notif.message}
                          </p>
                          <span className="text-[11px] text-[#908fa0]/80 mt-1 block">
                            {notif.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#464554]/30 text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-body-sm text-[#c0c1ff] hover:underline"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Botão de Salvar na Nuvem */}
          <button
            onClick={onSaveToCloud}
            disabled={isSavingCloud}
            className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg bg-[#8083ff]/15 hover:bg-[#8083ff]/25 border border-[#8083ff]/40 text-[#c0c1ff] hover:text-[#dae2fd] transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-sm text-body-sm font-medium disabled:opacity-50"
            title="Salvar dados na nuvem"
          >
            <span className={`material-symbols-outlined text-[18px] text-[#4edea3] ${isSavingCloud ? 'animate-spin' : ''}`}>
              {isSavingCloud ? 'sync' : 'cloud_upload'}
            </span>
            <span className="font-semibold text-[13px] whitespace-nowrap">
              {isSavingCloud ? 'Salvando...' : 'Salvar na nuvem'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
