import React from 'react';

interface PeriodFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPeriod: string;
  onSelectPeriod: (period: string) => void;
}

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export const PeriodFilterModal: React.FC<PeriodFilterModalProps> = ({
  isOpen,
  onClose,
  selectedPeriod,
  onSelectPeriod,
}) => {
  if (!isOpen) return null;

  // Normalize selected period to pure month name
  const currentMonth = selectedPeriod.replace(/\s*\d{4}/g, '').trim();

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#131b2e] border border-[#464554]/50 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#464554]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c0c1ff]">calendar_month</span>
            <div>
              <h2 className="text-headline-md font-bold text-[#dae2fd]">
                Filtrar por Mês
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#908fa0] hover:text-[#dae2fd] p-1 rounded-md cursor-pointer"
            aria-label="Fechar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="text-body-sm text-[#908fa0] mt-3 mb-4">
          Selecione o mês para filtrar os lançamentos e acompanhamento de gastos:
        </p>

        {/* Grade com os 12 meses do ano */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-2 max-h-[60vh] overflow-y-auto">
          {MONTHS.map((month) => {
            const isSelected = currentMonth === month;
            return (
              <button
                key={month}
                type="button"
                onClick={() => {
                  onSelectPeriod(month);
                  onClose();
                }}
                className={`text-left px-3.5 py-3 rounded-xl border text-body-md transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#222a3d] border-[#c0c1ff] text-[#c0c1ff] font-semibold ring-1 ring-[#c0c1ff]/40 shadow-sm'
                    : 'bg-[#0b1326] border-[#464554]/30 text-[#dae2fd] hover:bg-[#171f33] hover:border-[#464554]/60'
                }`}
              >
                <span>{month}</span>
                {isSelected && (
                  <span className="material-symbols-outlined text-[18px] text-[#c0c1ff]">check</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex justify-end pt-3 mt-4 border-t border-[#464554]/25">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-body-sm text-[#908fa0] hover:text-[#dae2fd] cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
