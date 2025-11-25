"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { STORY_SECTION_IDS } from "../constants";

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 dark:border-white/10 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left hover:text-blue-600 transition-colors group"
      >
        <span className="font-semibold text-lg text-slate-800 dark:text-white group-hover:text-blue-600">
          {question}
        </span>
        <ChevronDown
          className={`transition-transform duration-300 ${
            isOpen
              ? "rotate-180 text-blue-600"
              : "text-gray-400 dark:text-white/60"
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

export const FAQSection = () => (
  <section
    id={STORY_SECTION_IDS.faq}
    className="py-24 bg-[#f8fbff] dark:bg-[#010b1d] transition-colors"
  >
    <div className="max-w-3xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-sm font-bold text-blue-600 dark:text-blue-300 uppercase tracking-wider mb-2">
          Dúvidas Comuns
        </h2>
        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Perguntas Frequentes
        </h3>
      </div>

      <div className="space-y-2">
        <FAQItem
          question="Preciso pagar para usar a FlicApp?"
          answer="Não para solicitar! Você só paga uma pequena taxa de conexão quando decide contratar um profissional, que é descontada do valor final."
        />
        <FAQItem
          question="Os profissionais são de confiança?"
          answer="Sim. Nossa IA cruza dados públicos, antecedentes e avaliações anteriores. Apenas os 5% melhores entram na plataforma."
        />
        <FAQItem
          question="E se o serviço não ficar bom?"
          answer="Você tem a Garantia Flic. Se algo der errado, nosso suporte intervém e, se necessário, enviamos outro profissional sem custo ou devolvemos seu dinheiro."
        />
        <FAQItem
          question="Como funciona o pagamento?"
          answer="Tudo pelo Pix dentro do WhatsApp. O dinheiro fica retido conosco e só é liberado para o prestador quando você confirma que o serviço foi concluído."
        />
      </div>
    </div>
  </section>
);
