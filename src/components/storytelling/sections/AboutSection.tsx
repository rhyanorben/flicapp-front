import Image from "next/image";
import React from "react";
import { ShieldCheck } from "lucide-react";
import { STORY_SECTION_IDS } from "../constants";

export const AboutSection = () => (
  <section
    id={STORY_SECTION_IDS.about}
    className="py-24 bg-[#f5f9ff] dark:bg-[#020c1f] text-slate-900 dark:text-white relative overflow-hidden transition-colors"
  >
    <div className="absolute top-0 left-0 w-full h-full opacity-30 dark:opacity-10 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:16px_16px]"></div>
    <div className="max-w-6xl mx-auto px-6 relative z-10">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-sm font-bold text-blue-600 dark:text-blue-300 uppercase tracking-wider mb-2">
            Sobre Nós
          </h2>
          <h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-[#052051] dark:text-white">
            Conectando quem precisa com quem sabe fazer.
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-200 leading-relaxed mb-6">
            A FlicApp nasceu de uma frustração simples: por que é tão difícil
            encontrar um profissional de confiança rápido?
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-200 leading-relaxed mb-8">
            Criamos uma tecnologia invisível. Sem apps pesados, sem formulários
            infinitos. Apenas a simplicidade de uma conversa, potencializada por
            Inteligência Artificial para garantir segurança e agilidade.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-300 mb-1">
                10k+
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-300">
                Profissionais Verificados
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-300 mb-1">
                98%
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-300">
                Satisfação dos Clientes
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 dark:bg-white/5 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 border border-blue-100 dark:border-white/10">
            <Image
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Team"
              width={800}
              height={800}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white dark:bg-[#04122d] p-6 rounded-2xl shadow-xl border border-blue-100 dark:border-white/10 max-w-xs text-slate-900 dark:text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-white/10 rounded-full flex items-center justify-center text-blue-600 dark:text-white">
                <ShieldCheck size={20} />
              </div>
              <span className="font-bold text-sm">Segurança em 1º lugar</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-200">
              Todos os prestadores passam por checagem de antecedentes criminais
              e prova técnica.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
