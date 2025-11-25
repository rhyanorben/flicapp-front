"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  ChevronDown,
  Mic,
  ShieldCheck,
  Smile,
  Smartphone,
  Star,
  Zap,
  Clock,
} from "lucide-react";
import { AuthPage } from "./components/AuthPage";
import { PhoneMockup } from "./chat/PhoneMockup";
import { WhatsAppHeader } from "./chat/WhatsAppHeader";
import { WhatsAppBubble } from "./chat/WhatsAppBubble";
import { StepSection } from "./components/StepSection";
import { DashboardSection } from "./sections/DashboardSection";
import { AboutSection } from "./sections/AboutSection";
import { FAQSection } from "./sections/FAQSection";
import { StoryFooter } from "./sections/StoryFooter";
import { CHAT_SCRIPT } from "./data/chatScript";
import { StepContent } from "./types";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { STORY_SECTION_IDS, STORY_WHATSAPP_LINK } from "./constants";
import "./FlicAppScrollytelling.css";

export const FlicAppScrollytelling = () => {
  const [view, setView] = useState<"landing" | "auth">("landing");
  const [activeSection, setActiveSection] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const step5Ref = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const p1 = useScrollProgress(step1Ref);
  const p2 = useScrollProgress(step2Ref);
  const p3 = useScrollProgress(step3Ref);
  const p4 = useScrollProgress(step4Ref);
  const p5 = useScrollProgress(step5Ref);
  const pCta = useScrollProgress(ctaRef);

  const ICON_ACCENT =
    "bg-blue-50 text-blue-700 border-blue-100 dark:bg-white/10 dark:text-white dark:border-white/10";

  const stepSections: StepContent[] = [
    {
      id: 1,
      ref: step1Ref,
      anchorId: STORY_SECTION_IDS.steps[0],
      alignment: "left",
      icon: Smartphone,
      iconContainerClass: ICON_ACCENT,
      title: "1. Identificação Inteligente",
      description: (
        <>
          Você fala o problema{" "}
          <span className="text-blue-700 dark:text-blue-200 font-semibold bg-blue-50 dark:bg-white/10 px-1 rounded">
            &ldquo;chuveiro não esquenta&rdquo;
          </span>{" "}
          e nossa IA já sabe que precisa de um eletricista.
        </>
      ),
    },
    {
      id: 2,
      ref: step2Ref,
      anchorId: STORY_SECTION_IDS.steps[1],
      alignment: "right",
      icon: Clock,
      iconContainerClass: ICON_ACCENT,
      title: "2. Agendamento Simples",
      description:
        "Informe o CEP e escolha a janela de horário (Manhã, Tarde ou Noite) com apenas um número.",
    },
    {
      id: 3,
      ref: step3Ref,
      anchorId: STORY_SECTION_IDS.steps[2],
      alignment: "left",
      icon: ShieldCheck,
      iconContainerClass: ICON_ACCENT,
      title: "3. Segurança Total",
      description:
        "Confirmamos seus dados e geramos o Pix da taxa de conexão. Tudo na mesma tela.",
    },
    {
      id: 4,
      ref: step4Ref,
      anchorId: STORY_SECTION_IDS.steps[3],
      alignment: "right",
      icon: Zap,
      iconContainerClass: ICON_ACCENT,
      title: "4. Execução",
      description:
        "Receba os dados do profissional. Após o serviço, o pagamento final também é gerado ali mesmo.",
    },
    {
      id: 5,
      ref: step5Ref,
      anchorId: STORY_SECTION_IDS.steps[4],
      alignment: "left",
      icon: Star,
      iconContainerClass: ICON_ACCENT,
      title: "5. Avaliação",
      description:
        "Gostou? Avalie com estrelas e ajude a comunidade. Simples assim.",
    },
  ];

  const scrollToElement = useCallback((element?: HTMLElement | null) => {
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const scrollToSection = useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      scrollToElement(target);
    },
    [scrollToElement]
  );

  const scrollToStep = useCallback(
    (stepIndex: number) => {
      const refs = [step1Ref, step2Ref, step3Ref, step4Ref, step5Ref];
      const targetRef = refs[stepIndex - 1];
      scrollToElement(targetRef?.current);
    },
    [scrollToElement]
  );

  const handleStartStory = useCallback(() => {
    scrollToStep(1);
  }, [scrollToStep]);

  const handleLogoClick = useCallback(() => {
    scrollToSection(STORY_SECTION_IDS.hero);
  }, [scrollToSection]);

  useEffect(() => {
    if (pCta > 0.1) {
      setActiveSection(6);
      return;
    }

    const stepProgress = [p1, p2, p3, p4, p5];
    // Marcar como ativa quando progresso > 0.2 (mais cedo para textos aparecerem)
    for (let i = stepProgress.length - 1; i >= 0; i -= 1) {
      if (stepProgress[i] > 0.2) {
        setActiveSection(i + 1);
        return;
      }
    }

    setActiveSection(0);
  }, [p1, p2, p3, p4, p5, pCta]);

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      setTimeout(() => {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }, 50);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeSection, scrollToBottom]);

  if (view === "auth") {
    return <AuthPage onBack={() => setView("landing")} />;
  }

  return (
    <div className="bg-[#e8f1ff] dark:bg-[#010817] min-h-screen font-sans overflow-x-hidden text-[#0c1f3f] dark:text-white transition-colors duration-500">
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
        <button
          type="button"
          onClick={handleLogoClick}
          className="pointer-events-auto cursor-pointer flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1d4ed8] rounded-full bg-white/80 dark:bg-white/10 px-3 py-2 shadow-sm"
        >
          <Image
            src="/logo-flicapp-horizontal.png"
            alt="FlicApp"
            width={140}
            height={40}
            priority
            className="h-8 w-auto"
          />
        </button>
        <button
          onClick={() => setView("auth")}
          className="pointer-events-auto bg-white text-[#1d4ed8] dark:bg-transparent dark:text-white border border-blue-200 dark:border-white/30 px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-50 hover:text-[#0d1a2b] dark:hover:bg-white/10 transition-all backdrop-blur"
        >
          Entrar
        </button>
      </nav>

      <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden">
        <div
          className="transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-20 will-change-transform hidden md:block"
          style={{
            transform:
              activeSection === 0
                ? "translateY(110vh)"
                : activeSection >= 6
                ? "translateY(-130vh)"
                : "translateY(0)",
            opacity: activeSection === 0 || activeSection >= 6 ? 0 : 1,
          }}
        >
          <PhoneMockup scale={activeSection === 0 ? 0.9 : 1}>
            <WhatsAppHeader />
            <div className="flex-1 overflow-hidden relative z-10 flex flex-col">
              <div
                ref={chatContainerRef}
                className="flex-1 px-3 py-2 overflow-y-auto overflow-x-hidden flex flex-col min-h-0 scroll-smooth pb-10"
              >
                <div className="flex justify-center my-2 opacity-80 shrink-0">
                  <span className="bg-[#E1F3FB] text-gray-800 text-[10px] font-medium px-2 py-1 rounded shadow-sm border border-white/50 uppercase tracking-wide">
                    Hoje
                  </span>
                </div>
                <div className="flex justify-center mb-4 px-4 shrink-0">
                  <span className="bg-[#FFEF98] text-gray-800 text-[10px] px-2 py-1 rounded shadow-sm text-center leading-tight border border-yellow-200">
                    As mensagens são protegidas com criptografia de ponta a
                    ponta.
                  </span>
                </div>
                {CHAT_SCRIPT.map((msg) => (
                  <WhatsAppBubble
                    key={msg.id}
                    message={msg}
                    visible={activeSection >= msg.section && activeSection < 6}
                    onShow={scrollToBottom}
                  />
                ))}
                <div className="h-4 shrink-0" />
              </div>
              <div className="bg-[#f0f2f5] px-2 py-1.5 flex items-center gap-2 shrink-0 z-20 pb-5 pt-2 border-t border-gray-200/50 backdrop-blur-sm">
                <div className="bg-white flex-1 rounded-full h-10 flex items-center px-3 shadow-sm border border-white/50">
                  <Smile size={24} className="text-gray-400 mr-2" />
                  <div className="flex-1 text-gray-400 text-[15px] select-none">
                    Mensagem
                  </div>
                  <Camera size={22} className="text-gray-400" />
                </div>
                <div className="w-10 h-10 bg-[#008069] rounded-full flex items-center justify-center text-white shadow-lg">
                  <Mic size={22} />
                </div>
              </div>
            </div>
          </PhoneMockup>
        </div>
      </div>

      <div className="relative z-20">
        <section
          id={STORY_SECTION_IDS.hero}
          className="min-h-[100vh] flex flex-col items-center justify-center pointer-events-auto pb-20 sm:pb-32 lg:pb-40 bg-gradient-to-b from-white via-[#e8f1ff] to-[#d6e6ff] dark:from-[#010817] dark:via-[#04122d] dark:to-[#071a3d] transition-colors"
        >
          <div className="text-center px-4 max-w-4xl mx-auto mb-10 mt-16 md:mt-20 relative z-10">
            <div className="inline-flex items-center gap-2 bg-white text-[#1d4ed8] dark:bg-white/10 dark:text-white px-4 py-2 rounded-full text-sm font-bold mb-8 animate-bounce shadow-sm border border-blue-100 dark:border-white/20">
              <Zap size={16} fill="currentColor" />
              <span>Sem baixar aplicativos</span>
            </div>
            {/* ATUALIZADO: H1 com o efeito "SAL" (Sublinhado e Cor) de volta */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-6 md:mb-8 leading-tight">
              Resolva problemas do dia a dia com{" "}
              <span className="relative inline-block text-[#008069] dark:text-[#25D366] px-2">
                apenas um clique.
                {/* O famoso sublinhado 'pá' */}
                <svg
                  className="absolute w-full h-2 md:h-3 -bottom-1 left-0 text-[#25D366] dark:text-[#25D366] opacity-60 dark:opacity-80"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 50 10 100 5"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-8 md:mb-12 leading-relaxed px-2">
              Conectamos você aos melhores prestadores de serviço da sua região
              de forma rápida, segura e com a ajuda de Inteligência Artificial.
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleStartStory}
                className="flex flex-col items-center gap-3 mt-8 animate-bounce opacity-60 hover:opacity-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1d4ed8]"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-300">
                  Começar a história
                </span>
                <div className="w-12 h-12 bg-white dark:bg-white/10 rounded-full shadow-md flex items-center justify-center border border-gray-200 dark:border-white/10 text-[#1d4ed8] dark:text-white">
                  <ChevronDown size={24} strokeWidth={3} />
                </div>
              </button>
            </div>
          </div>
        </section>

        {stepSections.map((step) => (
          <StepSection
            key={step.id}
            step={step}
            isActive={activeSection === step.id}
          />
        ))}

        <section
          id={STORY_SECTION_IDS.cta}
          ref={ctaRef}
          className="min-h-[60vh] md:h-[80vh] bg-white dark:bg-[#020d22] flex items-center justify-center relative pointer-events-auto z-50 border-t border-slate-100 dark:border-white/10 transition-colors"
        >
          <div className="text-center max-w-3xl px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 md:mb-8">
              Fale agora com a Flic.
            </h2>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-200 mb-8 md:mb-12">
              Sem baixar nada. É só mandar um Zap.
            </p>
            <a
              href={STORY_WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full inline-flex items-center justify-center gap-2 sm:gap-3 hover:bg-[#1da851] transition-all shadow-xl hover:scale-105 mx-auto group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366] text-sm sm:text-base"
            >
              <Smartphone
                size={24}
                className="sm:w-7 sm:h-7 group-hover:animate-wiggle"
              />
              <div className="text-left">
                <div className="font-bold">Chamar no WhatsApp</div>
              </div>
            </a>
          </div>
        </section>

        <DashboardSection />
        <AboutSection />
        <FAQSection />
        <StoryFooter />
      </div>
    </div>
  );
};
