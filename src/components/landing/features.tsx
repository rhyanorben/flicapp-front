import React from "react";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";

const features = [
  {
    title: "Profissionais Confiáveis",
    description:
      "Acesse uma rede de prestadores verificados e bem avaliados pela comunidade.",
    icon: <CheckCircle2 className="h-6 w-6" />,
  },
  {
    title: "Segurança no Pagamento",
    description:
      "Pague pelos serviços diretamente na plataforma via pix ou cartão, com total segurança e transparência.",
    icon: <ShieldCheck className="h-6 w-6" />,
  },
  {
    title: "Agilidade e Praticidade",
    description:
      "Nossa IA encontra o profissional ideal para você em minutos, sem demora ou incerteza.",
    icon: <Zap className="h-6 w-6" />,
  },
];

export default function Features() {
  return (
    <section id="como-funciona" className="bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Por que escolher a FlicApp?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Confiabilidade, segurança e rapidez para resolver o que você
            precisa.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  {f.icon}
                </div>
                <h3 className="text-lg font-medium">{f.title}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
