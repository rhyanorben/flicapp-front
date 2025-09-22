import React from "react"

const features = [
  {
    title: "Encontre Profissionais Confiáveis",
    description:
      "Acesse uma rede de prestadores verificados e bem avaliados pela comunidade.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    title: "Segurança no Pagamento",
    description:
      "Pague pelos serviços diretamente na plataforma via pix ou cartão, com total segurança e transparência.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.657-1.79-3-4-3S4 9.343 4 11v3c0 1.657 1.79 3 4 3s4-1.343 4-3v-3zM20 7v10" />
      </svg>
    ),
  },
  {
    title: "Agilidade e Praticidade",
    description:
      "Nossa IA encontra o profissional ideal para você em minutos, sem demora ou incerteza.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
]

export default function Features() {
  return (
    <section id="como-funciona" className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">Por que escolher a FlicApp?</h2>
          <p className="mt-3 text-muted-foreground">
            Confiabilidade, segurança e rapidez para resolver o que você precisa.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-medium">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


