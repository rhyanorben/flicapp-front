import React from "react";
import { FileText, History, LayoutDashboard } from "lucide-react";
import { STORY_SECTION_IDS } from "../constants";

export const DashboardSection = () => (
  <section
    id={STORY_SECTION_IDS.dashboard}
    className="py-24 bg-gradient-to-b from-[#0a1f44] to-[#020a1c] text-white relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
    <div className="max-w-6xl mx-auto px-6 relative z-10">
      <div className="text-center mb-16">
        <span className="text-indigo-400 font-bold uppercase tracking-wider text-sm">
          Controle Total
        </span>
        <h2 className="text-4xl font-bold mt-2">Seu Painel de Controle Web</h2>
        <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
          A conversa acontece no WhatsApp, mas a organização fica na nossa
          Dashboard. Ao fazer login, você tem acesso a ferramentas exclusivas.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white text-[#0b1c39] dark:bg-white/5 dark:text-white p-8 rounded-2xl border border-blue-100 dark:border-white/10 hover:border-blue-400 transition-all group shadow-lg/10">
          <div className="w-12 h-12 bg-blue-100 dark:bg-white/10 text-blue-600 dark:text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <History size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">Histórico de Pedidos</h3>
          <p className="text-slate-500 dark:text-slate-200 text-sm leading-relaxed">
            Acesse todos os serviços já realizados, veja quem foi o profissional
            e quanto você pagou. Tudo organizado cronologicamente.
          </p>
        </div>

        <div className="bg-white text-[#0b1c39] dark:bg-white/5 dark:text-white p-8 rounded-2xl border border-blue-100 dark:border-white/10 hover:border-blue-400 transition-all group shadow-lg/10">
          <div className="w-12 h-12 bg-blue-100 dark:bg-white/10 text-blue-600 dark:text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FileText size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">Notas e Comprovantes</h3>
          <p className="text-slate-500 dark:text-slate-200 text-sm leading-relaxed">
            Precisa de reembolso ou garantia? Baixe notas fiscais e comprovantes
            de pagamento de qualquer serviço com um clique.
          </p>
        </div>

        <div className="bg-white text-[#0b1c39] dark:bg-white/5 dark:text-white p-8 rounded-2xl border border-blue-100 dark:border-white/10 hover:border-blue-400 transition-all group shadow-lg/10">
          <div className="w-12 h-12 bg-blue-100 dark:bg-white/10 text-blue-600 dark:text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <LayoutDashboard size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">Gestão de Perfil</h3>
          <p className="text-slate-500 dark:text-slate-200 text-sm leading-relaxed">
            Atualize seus dados, endereços salvos e preferências de pagamento.
            Mantenha tudo em dia para agilizar seus pedidos.
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <div className="inline-block bg-white/10 rounded-full px-6 py-3 border border-white/20">
          <span className="text-slate-100 text-sm">
            Disponível para todos os usuários cadastrados.{" "}
            <a
              href={`#${STORY_SECTION_IDS.cta}`}
              className="text-blue-200 hover:text-white font-semibold ml-1"
            >
              Cadastre-se agora →
            </a>
          </span>
        </div>
      </div>
    </div>
  </section>
);
