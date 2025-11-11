"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { BadgeInfo, MessageCircle, ShieldAlert } from "lucide-react";

type PainPoint = {
  title: string;
  description: string;
  statistic: string;
  percentage: number;
  icon: React.ReactNode;
};

const PAIN_POINTS: PainPoint[] = [
  {
    title: "Demora em receber propostas",
    description:
      "Você precisa de um serviço urgente, mas passa horas ou dias esperando respostas de prestadores.",
    statistic: "72% das pessoas aguardam mais de 48 horas",
    percentage: 72,
    icon: <BadgeInfo className="h-4 w-4" aria-hidden="true" />,
  },
  {
    title: "Insegurança com qualidade",
    description:
      "Não sabe se o prestador é confiável, qual o histórico de trabalho ou se vai cumprir o combinado.",
    statistic: "65% já tiveram experiência ruim",
    percentage: 65,
    icon: <ShieldAlert className="h-4 w-4" aria-hidden="true" />,
  },
  {
    title: "Dificuldade de comunicação",
    description:
      "Problemas para alinhar expectativas, combinar detalhes e acompanhar o andamento do serviço.",
    statistic: "58% relatam problemas de alinhamento",
    percentage: 58,
    icon: <MessageCircle className="h-4 w-4" aria-hidden="true" />,
  },
];

function CircleStat({ percentage }: { percentage: number }) {
  const r = 50;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - percentage / 100);
  return (
    <div className="relative h-40 w-40">
      <svg viewBox="0 0 120 120" className="h-40 w-40 -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={r}
          className="text-muted/30"
          stroke="currentColor"
          strokeWidth="12"
          fill="none"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          stroke="hsl(var(--primary))"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          initial={{ strokeDasharray: c, strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-4xl font-bold tabular-nums text-foreground">
            {percentage}
            <span className="text-2xl text-primary">%</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">das pessoas</div>
        </div>
      </div>
    </div>
  );
}

export function PinnedPanels() {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  // Observer para ativar a etapa correta
  useEffect(() => {
    if (typeof window === "undefined") return;
    const rootMargin = "-45% 0px -45% 0px"; // ativa quando o centro da seção entra
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number((entry.target as HTMLElement).dataset.index);
          if (entry.isIntersecting) setActive(idx);
        });
      },
      { root: null, rootMargin, threshold: 0.01 }
    );
    itemRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // reduz motion: cai pra uma lista simples
  const prefersReduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
    []
  );

  return (
    <section
      id="problemas"
      className="relative isolate bg-gradient-to-b from-background via-muted/20 to-background py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6">
            Procurar serviço não deveria ser difícil
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Mas muitas vezes é. Veja os problemas mais comuns:
          </p>
        </div>

        {/* Timeline de indicadores (apenas visual, não sticky) */}
        <div className="hidden lg:flex justify-center gap-8 mb-16">
          {PAIN_POINTS.map((p, i) => {
            const isActive = i === active;
            return (
              <div
                key={i}
                className="flex flex-col items-center gap-2 transition-all"
              >
                <div
                  className={[
                    "flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110"
                      : "bg-muted text-muted-foreground scale-100",
                  ].join(" ")}
                >
                  {p.icon}
                </div>
                <span
                  className={[
                    "text-xs font-medium text-center transition-all max-w-[120px]",
                    isActive ? "text-foreground" : "text-muted-foreground/60",
                  ].join(" ")}
                >
                  {p.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Cards com melhor espaçamento */}
        <div className="space-y-32 lg:space-y-40">
          {PAIN_POINTS.map((p, i) => (
            <SectionCard
              key={i}
              index={i}
              data={p}
              attachRef={(el) => (itemRefs.current[i] = el)}
              reduced={prefersReduced}
            />
          ))}
        </div>

        {/* CTA para próxima seção */}
        <div className="mt-24 text-center">
          <p className="text-muted-foreground mb-4">
            Esses problemas são do passado com a FlicApp
          </p>
          <a
            href="#a-virada"
            className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:underline underline-offset-4"
          >
            Veja como funciona →
          </a>
        </div>
      </div>
    </section>
  );
}

function SectionCard({
  data,
  index,
  attachRef,
}: {
  data: PainPoint;
  index: number;
  attachRef: (el: HTMLElement | null) => void;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    attachRef(ref.current);
  }, [attachRef]);

  const inView = useInView(ref, { margin: "-30% 0px -30% 0px", amount: 0.3 });

  return (
    <motion.article
      ref={ref}
      data-index={index}
      className="scroll-mt-32"
      aria-label={`Problema ${index + 1}: ${data.title}`}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">
        {/* Conteúdo principal */}
        <div>
          {/* Badge do número */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {data.icon}
            <span>Problema {index + 1}</span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
            {data.title}
          </h3>

          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {data.description}
          </p>

          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-lg bg-muted/50 border border-border">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <p className="text-sm font-semibold text-foreground">
              {data.statistic}
            </p>
          </div>
        </div>

        {/* Estatística circular */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <CircleStat percentage={data.percentage} />
            {/* Glow effect */}
            <div
              className="absolute inset-0 -z-10 blur-2xl opacity-20"
              style={{
                background:
                  "radial-gradient(closest-side, hsl(var(--primary)), transparent)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Linha divisória sutil */}
      {index < PAIN_POINTS.length - 1 && (
        <div className="mt-20 lg:mt-28 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      )}
    </motion.article>
  );
}
