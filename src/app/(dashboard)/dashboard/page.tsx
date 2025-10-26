import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Instagram,
  MessageCircle,
  ShieldCheck,
  Zap,
  Sparkles,
  LifeBuoy,
} from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="relative flex flex-1 flex-col gap-8 p-4 pt-0">
      {/* Background gradient and subtle decorative shapes */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-52 bg-gradient-to-b from-primary/15 to-transparent dark:from-primary/10 blur-2xl" />
      <div className="pointer-events-none absolute -top-20 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-violet-400/10 dark:bg-violet-300/10 blur-3xl" />

      {/* Hero */}
      <section className="relative flex flex-1 items-center justify-center">
        <div className="text-center max-w-4xl mx-auto py-20">
          <h1 className="animate-in fade-in-0 slide-in-from-bottom-2 duration-700 text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Home
          </h1>
          <p
            className="animate-in fade-in-0 slide-in-from-bottom-2 duration-700 text-base md:text-lg text-muted-foreground leading-relaxed"
            style={{ animationDelay: "120ms" }}
          >
            Resolva seus problemas do dia a dia com um clique.{" "}
            <br className="hidden sm:block" />
            Conectamos você aos melhores prestadores de serviço da sua região de
            forma rápida, segura e com a ajuda de Inteligência Artificial.
          </p>
          <div
            className="mt-10 flex items-center justify-center gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-700"
            style={{ animationDelay: "220ms" }}
          >
            <Button
              asChild
              className="transition-transform duration-300 hover:scale-[1.04] hover:shadow-lg"
            >
              <Link
                href="https://instagram.com/seu_perfil"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="transition-transform duration-300 hover:scale-[1.04] hover:shadow-lg"
            >
              <Link
                href="https://wa.me/5599999999999"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Destaques / Benefícios */}
      <section className="relative pb-10">
        <h2 className="text-2xl font-semibold mb-6">Destaques / Benefícios</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card
            className="transition-transform duration-300 hover:scale-[1.02] hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-2"
            style={{ animationDelay: "80ms" }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Segurança garantida
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Seus dados e transações com proteção e transparência.
            </CardContent>
          </Card>

          <Card
            className="transition-transform duration-300 hover:scale-[1.02] hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-2"
            style={{ animationDelay: "140ms" }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="w-5 h-5 text-primary" />
                Agilidade
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Encontre e contrate em poucos cliques, sem complicação.
            </CardContent>
          </Card>

          <Card
            className="transition-transform duration-300 hover:scale-[1.02] hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-2"
            style={{ animationDelay: "200ms" }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="w-5 h-5 text-primary" />
                IA que recomenda os melhores
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Sugestões inteligentes com base no seu perfil e necessidade.
            </CardContent>
          </Card>

          <Card
            className="transition-transform duration-300 hover:scale-[1.02] hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-2"
            style={{ animationDelay: "260ms" }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <LifeBuoy className="w-5 h-5 text-primary" />
                Suporte 24h
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Estamos disponíveis para ajudar quando você precisar.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Rodapé elegante */}
      <footer className="mt-6 rounded-lg border bg-foreground/[0.05] dark:bg-foreground/[0.08] px-6 py-6">
        <div className="flex flex-col gap-4 items-center justify-between sm:flex-row">
          <div className="flex gap-5 text-sm text-foreground/80">
            <a href="#" className="transition-colors hover:text-primary">
              Sobre
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Contato
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Política de Privacidade
            </a>
          </div>
          <div className="flex items-center gap-4 text-foreground/80">
            <a
              href="https://instagram.com/seu_perfil"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition-transform hover:scale-110 hover:text-primary"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/5599999999999"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="transition-transform hover:scale-110 hover:text-primary"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
          <div className="text-xs text-foreground/70">
            © 2025 FlicApp — Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
