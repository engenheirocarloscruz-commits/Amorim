import React, { useState } from 'react';
import { FinancialGoal } from '../../types';

interface NewGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
}

export const NewGoalModal: React.FC<NewGoalModalProps> = ({
  isOpen,
  onClose,
  onSaveGoal,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [monthlyDeposit, setMonthlyDeposit] = useState('');
  const [targetDate, setTargetDate] = useState('Dezembro 2025');
  const [icon, setIcon] = useState('savings');
  const [color, setColor] = useState<'primary' | 'secondary' | 'surface-tint'>('secondary');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTarget = parseFloat(targetAmount.replace(',', '.'));
    const parsedCurrent = parseFloat(currentAmount.replace(',', '.')) || 0;
    const parsedMonthly = parseFloat(monthlyDeposit.replace(',', '.')) || 500;

    if (!title.trim() || isNaN(parsedTarget) || parsedTarget <= 0) return;

    onSaveGoal({
      title: title.trim(),
      description: description.trim() || 'Meta de poupança familiar',
      targetAmount: parsedTarget,
      currentAmount: parsedCurrent,
      monthlyDeposit: parsedMonthly,
      targetDate: targetDate.trim(),
      icon,
      color,
    });

    onClose();
  };

  const goalIcons = [
    { icon: 'shield', label: 'Segurança' },
    { icon: 'flight_takeoff', label: 'Viagem' },
    { icon: 'car_repair', label: 'Veículo' },
    { icon: 'apartment', label: 'Imóvel' },
    { icon: 'school', label: 'Educação' },
    { icon: 'savings', label: 'Poupança' },
    { icon: 'laptop_mac', label: 'Tecnologia' },
    { icon: 'diamond', label: 'Sonho' },
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#131b2e] border border-[#464554]/50 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#464554]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3]">flag</span>
            <h2 className="text-headline-md font-bold text-[#dae2fd]">
              Criar Nova Meta Financeira
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#908fa0] hover:text-[#dae2fd] p-1 rounded-md"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 my-4 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <label className="text-label-caps text-[#908fa0] block mb-1">
              NOME DO SONHO / META
            </label>
            <input
              type="text"
              placeholder="Ex: Reforma da Cozinha, Viagem Japão..."
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-md focus:outline-none focus:border-[#c0c1ff]"
            />
          </div>

          <div>
            <label className="text-label-caps text-[#908fa0] block mb-1">
              DESCRIÇÃO / OBJETIVO DETALHADO
            </label>
            <input
              type="text"
              placeholder="Ex: Reserva para compra à vista com desconto"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-md focus:outline-none focus:border-[#c0c1ff]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-label-caps text-[#908fa0] block mb-1">
                VALOR DO ALVO (€)
              </label>
              <input
                type="text"
                placeholder="20.000,00"
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-md focus:outline-none focus:border-[#c0c1ff]"
              />
            </div>

            <div>
              <label className="text-label-caps text-[#908fa0] block mb-1">
                VALOR JÁ ACUMULADO (€)
              </label>
              <input
                type="text"
                placeholder="0,00"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-md focus:outline-none focus:border-[#c0c1ff]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-label-caps text-[#908fa0] block mb-1">
                APORTE MENSAL PLANEJADO (€)
              </label>
              <input
                type="text"
                placeholder="1.000,00"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-md focus:outline-none focus:border-[#c0c1ff]"
              />
            </div>

            <div>
              <label className="text-label-caps text-[#908fa0] block mb-1">
                PREVISÃO DE TÉRMINO
              </label>
              <input
                type="text"
                placeholder="Ex: Dezembro 2025"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-md focus:outline-none focus:border-[#c0c1ff]"
              />
            </div>
          </div>

          <div>
            <label className="text-label-caps text-[#908fa0] block mb-1.5">
              ÍCONE DA META
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {goalIcons.map((item) => (
                <button
                  key={item.icon}
                  type="button"
                  onClick={() => setIcon(item.icon)}
                  className={`h-10 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                    icon === item.icon
                      ? 'bg-[#00a572]/20 text-[#4edea3] border-[#4edea3]'
                      : 'bg-[#0b1326] text-[#908fa0] border-[#464554]/30 hover:text-[#dae2fd]'
                  }`}
                  title={item.label}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#464554]/30 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-body-md text-[#908fa0] hover:text-[#dae2fd] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#4edea3] text-[#003824] font-bold text-body-md hover:bg-[#6ffbbe] transition-all cursor-pointer"
            >
              Salvar Meta Familiar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
