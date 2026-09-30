import React from 'react';

export const SupportScreen: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <section>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-label-caps text-[#c0c1ff] uppercase tracking-wider font-semibold">
            CENTRAL DE AJUDA
          </span>
          <span className="w-1 h-1 rounded-full bg-[#464554]" />
          <span className="text-label-caps text-[#908fa0]">WealthFlow Concierge</span>
        </div>
        <h1 className="text-headline-lg font-bold text-[#dae2fd] tracking-tight">
          Suporte &amp; Gestão Financeira Familiar
        </h1>
        <p className="text-body-md text-[#c7c4d7]">
          Dúvidas frequentes sobre tetos de gastos, cálculo de projeção e sincronização de aportes.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            icon: 'trending_up',
            title: 'Como a Projeção Final é calculada?',
            desc: 'A projeção final projeta o ritmo médio diário dos dias decorridos para os dias restantes do mês atual.',
          },
          {
            icon: 'savings',
            title: 'Como funcionam os Aportes em Metas?',
            desc: 'Ao realizar um aporte na meta, o saldo acumulado é incrementado imediatamente e a barra de progresso avança.',
          },
          {
            icon: 'warning',
            title: 'O que fazer quando uma categoria estoura?',
            desc: 'Você pode redistribuir saldo de categorias saudáveis (como Transporte ou Saúde) ou ajustar o teto da categoria.',
          },
          {
            icon: 'lock',
            title: 'Segurança dos Dados Financeiros',
            desc: 'Seus dados de planejamento familiar são mantidos com isolamento seguro e controle de acesso baseado em papéis.',
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-[#131b2e] border border-[#464554]/30 hover:border-[#908fa0] transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-[#222a3d] text-[#c0c1ff] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            </div>
            <h3 className="text-body-lg font-semibold text-[#dae2fd] mb-1">
              {item.title}
            </h3>
            <p className="text-body-sm text-[#908fa0] leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-[#171f33] border border-[#464554]/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-headline-md font-semibold text-[#dae2fd]">
            Precisa de consultoria patrimonial personalizada?
          </h3>
          <p className="text-body-sm text-[#908fa0] mt-1">
            Nossos especialistas em gestão familiar WealthFlow estão disponíveis via chat concierge.
          </p>
        </div>
        <button
          onClick={() => alert('Canal concierge prioritário WealthFlow ativo para a Família Oliveira.')}
          className="px-5 py-2.5 rounded-lg bg-[#c0c1ff] hover:bg-[#a5a7ff] text-[#1000a9] font-bold text-body-md whitespace-nowrap cursor-pointer"
        >
          Iniciar Concierge
        </button>
      </div>
    </div>
  );
};
