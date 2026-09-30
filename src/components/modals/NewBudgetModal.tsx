import React, { useState, useEffect } from 'react';
import { BudgetCategory } from '../../types';

interface NewBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBudget: (budget: Partial<BudgetCategory>) => void;
  budgetToEdit?: BudgetCategory | null;
}

export const NewBudgetModal: React.FC<NewBudgetModalProps> = ({
  isOpen,
  onClose,
  onSaveBudget,
  budgetToEdit,
}) => {
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [limit, setLimit] = useState('');
  const [icon, setIcon] = useState('shopping_basket');

  useEffect(() => {
    if (budgetToEdit) {
      setName(budgetToEdit.name);
      setSubtitle(budgetToEdit.subtitle);
      setLimit(budgetToEdit.limit.toString());
      setIcon(budgetToEdit.icon);
    } else {
      setName('');
      setSubtitle('');
      setLimit('');
      setIcon('shopping_basket');
    }
  }, [budgetToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLimit = parseFloat(limit.replace(',', '.'));
    if (!name.trim() || isNaN(parsedLimit) || parsedLimit <= 0) return;

    onSaveBudget({
      id: budgetToEdit?.id,
      name: name.trim(),
      subtitle: subtitle.trim() || 'Despesas gerais da categoria',
      limit: parsedLimit,
      icon,
    });

    onClose();
  };

  const availableIcons = [
    { icon: 'shopping_basket', label: 'Mercado' },
    { icon: 'home', label: 'Moradia' },
    { icon: 'directions_car', label: 'Transporte' },
    { icon: 'restaurant', label: 'Lazer' },
    { icon: 'medical_services', label: 'Saúde' },
    { icon: 'checkroom', label: 'Vestuário' },
    { icon: 'school', label: 'Educação' },
    { icon: 'pets', label: 'Pets' },
    { icon: 'fitness_center', label: 'Fitness' },
    { icon: 'build', label: 'Reformas' },
    { icon: 'local_cafe', label: 'Cafés' },
    { icon: 'sports_esports', label: 'Games' },
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#131b2e] border border-[#464554]/50 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#464554]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c0c1ff]">
              {budgetToEdit ? 'edit_note' : 'add_circle'}
            </span>
            <h2 className="text-headline-md font-bold text-[#dae2fd]">
              {budgetToEdit ? 'Ajustar Orçamento' : 'Definir Novo Orçamento'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#908fa0] hover:text-[#dae2fd] p-1 rounded-md"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          <div>
            <label className="text-label-caps text-[#908fa0] block mb-1">
              NOME DA CATEGORIA
            </label>
            <input
              type="text"
              placeholder="Ex: Educação & Cursos, Manutenção..."
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-md focus:outline-none focus:border-[#c0c1ff]"
            />
          </div>

          <div>
            <label className="text-label-caps text-[#908fa0] block mb-1">
              SUBTÍTULO / ITENS INCLUÍDOS
            </label>
            <input
              type="text"
              placeholder="Ex: Mensalidades, apostilas, software"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-md focus:outline-none focus:border-[#c0c1ff]"
            />
          </div>

          <div>
            <label className="text-label-caps text-[#908fa0] block mb-1">
              LIMITE MENSAL (TETO)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-[#908fa0]">
                €
              </span>
              <input
                type="text"
                placeholder="1.000,00"
                required
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full h-10 pl-11 pr-4 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-headline-md font-semibold focus:outline-none focus:border-[#c0c1ff]"
              />
            </div>
          </div>

          <div>
            <label className="text-label-caps text-[#908fa0] block mb-1.5">
              ÍCONE REPRESENTATIVO
            </label>
            <div className="grid grid-cols-6 gap-2">
              {availableIcons.map((item) => (
                <button
                  key={item.icon}
                  type="button"
                  onClick={() => setIcon(item.icon)}
                  className={`h-10 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                    icon === item.icon
                      ? 'bg-[#8083ff]/20 text-[#c0c1ff] border-[#c0c1ff]'
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
              className="px-5 py-2.5 rounded-lg bg-[#c0c1ff] text-[#1000a9] font-bold text-body-md hover:bg-[#a5a7ff] transition-all cursor-pointer"
            >
              {budgetToEdit ? 'Atualizar Limite' : 'Criar Orçamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
