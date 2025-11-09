"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Star, CheckCircle2, FileText } from "lucide-react";
import rawCopy from "../data/copy.json";

/** ====== Tipos & util ====== */
type TrustFeature = {
  key: "verification" | "ratings" | "guarantee" | "policy";
  title: string;
  description: string;
};

type TrustCopy = {
  title: string;
  subtitle: string;
  averageRating: number; // ex.: 4.8
  totalReviews: number; // renomeie no JSON se necessário (antes: totalOrders)
  features: TrustFeature[];
};

const trustIcons = {
  verification: ShieldCheck,
  ratings: Star,
  guarantee: CheckCircle2,
  policy: FileText,
} as const;

// garante estrutura mínima mesmo se o JSON vier incompleto
const copyData: { trust: TrustCopy } = {
  trust: {
    title: rawCopy?.trust?.title ?? "Confiança em primeiro lugar",
    subtitle:
      rawCopy?.trust?.subtitle ??
      "Contrate com segurança: verificação, avaliações reais e pagamento protegido.",
    averageRating: Number(rawCopy?.trust?.averageRating ?? 4.8),
    totalReviews: Number(
      (rawCopy?.trust as { totalReviews?: number; totalOrders?: number })
        ?.totalReviews ??
        rawCopy?.trust?.totalOrders ??
        12000
    ),
    features: (rawCopy?.trust?.features as TrustFeature[])?.filter(Boolean) ?? [
      {
        key: "verification",
        title: "Prestadores verificados",
        description:
          "Identidade e documentos checados para mais segurança nas contratações.",
      },
      {
        key: "ratings",
        title: "Avaliações reais",
        description:
          "Notas e comentários de clientes para você escolher com confiança.",
      },
      {
        key: "guarantee",
        title: "Pagamento protegido",
        description:
          "Seu dinheiro só é liberado ao final, quando você estiver satisfeito.",
      },
      {
        key: "policy",
        title: "Políticas claras",
        description:
          "Cancelamento, reembolso e suporte com regras transparentes.",
      },
    ],
  },
};

/** ====== UI util ====== */
function AnimatedCounter({
  value,
  duration = 1.6,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    let start = 0;

    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / (duration * 1000), 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setCount(value);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <Star
            key={i}
            className={`h-5 w-5 ${
              filled
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/30"
            }`}
            aria-hidden="true"
          />
        );
      })}
      <span className="ml-2 text-sm text-muted-foreground">
        {rating.toFixed(1)}/5.0
      </span>
    </div>
  );
}

/** ====== Blocos ====== */
function Metrics() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <Card
      ref={ref}
      className="relative overflow-hidden bg-card/80 ring-1 ring-border/60 shadow-xl backdrop-blur-sm"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px 420px at 50% -20%, hsl(var(--primary)/0.10), transparent 60%)",
        }}
      />
      <CardContent className="relative p-8 sm:p-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
          >
            <Stars rating={copyData.trust.averageRating} />
          </motion.div>

          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-bold tabular-nums">
              <AnimatedCounter
                value={copyData.trust.averageRating}
                decimals={1}
              />
            </span>
            <span className="text-3xl text-muted-foreground">/5.0</span>
          </div>

          <Badge
            variant="secondary"
            className="px-4 py-2 text-sm font-semibold bg-primary/10 text-primary border-primary/20"
          >
            <AnimatedCounter value={copyData.trust.totalReviews} suffix="+" />{" "}
            avaliações
          </Badge>

          <p className="text-base text-muted-foreground">
            Baseado em avaliações reais de clientes
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureCard({ f, i }: { f: TrustFeature; i: number }) {
  const Icon = trustIcons[f.key] ?? ShieldCheck;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: i * 0.06 }}
    >
      <Card className="h-full bg-card/80 ring-1 ring-border/60 shadow-xl backdrop-blur-sm transition-transform">
        <CardHeader className="pb-3">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-2 ring-primary/20">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-lg">{f.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {f.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/** ====== Seção principal ====== */
export function Trust() {
  return (
    <section
      id="confianca"
      className="relative isolate bg-gradient-to-b from-background via-muted/20 to-background py-24 sm:py-28"
    >
      {/* manchas suaves */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-24 left-1/2 h-[36rem] w-[48rem] -translate-x-1/2 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, hsl(var(--primary)/0.10), transparent 60%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-[28rem] w-[28rem] blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, hsl(var(--secondary)/0.12), transparent 60%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            {copyData.trust.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {copyData.trust.subtitle}
          </p>
        </div>

        {/* Métricas */}
        <div className="mb-14">
          <Metrics />
        </div>

        {/* Features */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {copyData.trust.features.map((f, i) => (
            <FeatureCard key={f.key ?? i} f={f} i={i} />
          ))}
        </div>

        {/* Selo final */}
        <div className="mt-16 flex justify-center">
          <div className="flex items-center gap-4 rounded-xl border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-6 py-4 shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-base font-bold">Prestadores verificados</div>
              <div className="text-sm text-muted-foreground">
                Identidade e documentos checados. Mais segurança para você.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
