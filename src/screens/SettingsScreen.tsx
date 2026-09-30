import React, { useState } from 'react';

interface SettingsScreenProps {
  onResetData: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onResetData }) => {
  const [notifyAt85, setNotifyAt85] = useState(true);
  const [notifyAt95, setNotifyAt95] = useState(true);
  const [notifyExceeded, setNotifyExceeded] = useState(true);
  const [householdName, setHouseholdName] = useState('Família Oliveira');

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-label-caps text-[#c0c1ff] uppercase tracking-wider font-semibold">
            PREFERÊNCIAS & FAMÍLIA
          </span>
          <span className="w-1 h-1 rounded-full bg-[#464554]" />
          <span className="text-label-caps text-[#908fa0]">Configurações Gerais</span>
        </div>
        <h1 className="text-headline-lg font-bold text-[#dae2fd] tracking-tight">
          Configurações da Conta Familiar
        </h1>
        <p className="text-body-md text-[#c7c4d7]">
          Personalize permissões de membros, regras de notificação de teto e parâmetros financeiros.
        </p>
      </section>

      {/* Household Profile */}
      <section className="rounded-xl bg-[#131b2e] border border-[#464554]/30 p-6 flex flex-col gap-5">
        <h2 className="text-headline-md font-semibold text-[#dae2fd]">
          Perfil do Núcleo Familiar
        </h2>

        <div className="flex items-center gap-4">
          <img
            alt="Avatar Familiar"
            className="w-16 h-16 rounded-full border border-[#464554]/40 object-cover ring-2 ring-[#c0c1ff]/30"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL3FI90CRaHgYYsMd5KH-p7cYqMYEZoxbkyLCB6p3R6KORHOav2Y5BXbML1nO9SPLlbvedq8uYq6luB_bt9ZwmtShpELOhjRJ1FQvcyE6Uvrxf9ZeHe7qzGXel-lGjIq1uoN0LCCb3aUqoM_8h5a1qG2tVPSbsV_BvWNwt2AEbmuMDtut0bcGClUwluaVh4xU__DFMBFl6VYqg1fLKfm1PNBE7SzZsahU9UEHLXOA__SVluVnOrcZX"
          />
          <div>
            <label className="text-label-caps text-[#908fa0] block mb-1">
              NOME DO GRUPO FAMILIAR
            </label>
            <input
              type="text"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              className="h-10 px-3 rounded-lg bg-[#0b1326] border border-[#464554]/40 text-[#dae2fd] text-body-md focus:outline-none focus:border-[#c0c1ff] w-64"
            />
          </div>
        </div>

        {/* Family Members list */}
        <div className="mt-4 pt-4 border-t border-[#464554]/30">
          <h3 className="text-body-md font-semibold text-[#dae2fd] mb-3">
            Membros com Acesso
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Carlos Cruz', role: 'Administrador Familiar (Você)', email: 'engenheirocarloscruz@gmail.com', tag: 'Acesso Total' },
              { name: 'Mariana Oliveira', role: 'Cônjuge / Co-administradora', email: 'mariana.oliveira@email.com', tag: 'Editor' },
              { name: 'Lucas Oliveira', role: 'Dependente', email: 'lucas.oliveira@email.com', tag: 'Visualizador' },
            ].map((member, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-[#171f33] border border-[#464554]/20"
              >
                <div>
                  <div className="text-body-md font-medium text-[#dae2fd]">{member.name}</div>
                  <div className="text-body-sm text-[#908fa0]">{member.role} • {member.email}</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#222a3d] text-[#c0c1ff] border border-[#464554]/40 text-label-caps">
                  {member.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notification Rules */}
      <section className="rounded-xl bg-[#131b2e] border border-[#464554]/30 p-6 flex flex-col gap-4">
        <h2 className="text-headline-md font-semibold text-[#dae2fd]">
          Alertas de Teto de Gastos
        </h2>
        <p className="text-body-sm text-[#908fa0]">
          Configure os gatilhos automáticos para emissão de avisos quando o ritmo de consumo acelerar.
        </p>

        <div className="space-y-3 mt-2">
          <label className="flex items-center justify-between p-3 rounded-lg bg-[#171f33] border border-[#464554]/20 cursor-pointer">
            <div>
              <div className="text-body-md font-medium text-[#dae2fd]">
                Alerta de Consumo Moderado (85%)
              </div>
              <div className="text-body-sm text-[#908fa0]">
                Avisa quando a categoria atingir 85% do teto antes do dia 20 do mês.
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifyAt85}
              onChange={(e) => setNotifyAt85(e.target.checked)}
              className="w-5 h-5 rounded border-[#464554] text-[#8083ff] focus:ring-[#8083ff]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-[#171f33] border border-[#464554]/20 cursor-pointer">
            <div>
              <div className="text-body-md font-medium text-[#dae2fd]">
                Alerta Crítico de Proximidade (95%)
              </div>
              <div className="text-body-sm text-[#908fa0]">
                Destaca em âmbar/vermelho a barra de progresso da categoria.
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifyAt95}
              onChange={(e) => setNotifyAt95(e.target.checked)}
              className="w-5 h-5 rounded border-[#464554] text-[#8083ff] focus:ring-[#8083ff]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-[#171f33] border border-[#464554]/20 cursor-pointer">
            <div>
              <div className="text-body-md font-medium text-[#dae2fd]">
                Bloqueio / Alerta de Limite Excedido (100%+)
              </div>
              <div className="text-body-sm text-[#908fa0]">
                Exibe badge vermelho 'Excedido' e calcula o estouro no consolidado.
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifyExceeded}
              onChange={(e) => setNotifyExceeded(e.target.checked)}
              className="w-5 h-5 rounded border-[#464554] text-[#8083ff] focus:ring-[#8083ff]"
            />
          </label>
        </div>
      </section>

      {/* Danger Zone / Reset */}
      <section className="rounded-xl bg-[#131b2e] border border-[#ff516a]/30 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-headline-md font-bold text-[#ffb2b7]">
            Restaurar Dados Padrão de Demonstração
          </h3>
          <p className="text-body-sm text-[#908fa0] mt-0.5">
            Recarrega os orçamentos, metas e valores exatamente como no layout original (Março 2025).
          </p>
        </div>

        <button
          onClick={onResetData}
          className="px-4 py-2 rounded-lg bg-[#93000a]/40 hover:bg-[#93000a] text-[#ffb4ab] border border-[#ff516a]/40 font-semibold text-body-md transition-colors cursor-pointer shrink-0"
        >
          Restaurar Demonstração
        </button>
      </section>
    </div>
  );
};
