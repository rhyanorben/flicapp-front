"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  Star,
  UserCircle,
  Bell,
  MessageSquare,
  Calendar,
  BarChart,
  Gift,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import copyData from "../data/copy.json";
import { trackPricingToggle } from "@/lib/analytics";
import { useState } from "react";

// Ícones para features do cliente
const clienteIcons = [Globe, Sparkles, MessageCircle, ShieldCheck, Star];

// Ícones para features do prestador
const prestadorIcons = [UserCircle, Bell, MessageSquare, Calendar, BarChart];

interface PricingCardProps {
  type: "cliente" | "prestador";
  data: typeof copyData.pricing.cliente | typeof copyData.pricing.prestador;
  index: number;
  icons: React.ComponentType<{ className?: string }>[];
}

function PricingCard({ type, data, index, icons }: PricingCardProps) {
  const isCliente = type === "cliente";
  const hasFutureNote = "futureNote" in data && data.futureNote;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="h-full"
    >
      <Card
        className={`relative h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
          isCliente
            ? "border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background"
            : "border-orange-500/20 bg-gradient-to-br from-orange-500/5 via-background to-background"
        }`}
      >
        {/* Badge de destaque no canto superior direito */}
        {isCliente && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold shadow-lg">
              <Gift className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          </div>
        )}

        {/* Alerta de taxa futura para prestador */}
        {hasFutureNote && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500/20 via-orange-500/30 to-orange-500/20 border-b border-orange-500/40">
            <div className="flex items-center justify-center gap-2 px-4 py-3">
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                {data.futureNote}
              </p>
            </div>
          </div>
        )}

        <CardHeader
          className={`text-center pb-6 ${hasFutureNote ? "pt-20" : "pt-8"}`}
        >
          {/* Badge de preço grande */}
          <div className="mb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`inline-flex items-center justify-center rounded-2xl px-8 py-4 ${
                isCliente
                  ? "bg-primary text-primary-foreground"
                  : "bg-orange-500 text-white"
              } shadow-lg`}
            >
              <span className="text-5xl font-bold tabular-nums">
                {data.price}
              </span>
              {!isCliente && (
                <span className="ml-2 text-xl font-medium opacity-90">
                  agora
                </span>
              )}
            </motion.div>
          </div>

          {/* Período */}
          <p className="text-lg font-medium text-muted-foreground mb-4">
            {data.period}
          </p>

          {/* Descrição */}
          <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
            {data.description}
          </p>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Features em grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {data.features.map((feature, featureIndex) => {
              const Icon = icons[featureIndex] || CheckCircle2;
              return (
                <motion.div
                  key={featureIndex}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + featureIndex * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`shrink-0 mt-0.5 p-1.5 rounded-lg ${
                      isCliente
                        ? "bg-primary/10 text-primary"
                        : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm leading-relaxed">{feature}</span>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <button
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                isCliente
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl"
                  : "bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl"
              }`}
            >
              {isCliente ? "Começar grátis" : "Cadastrar-se grátis"}
            </button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function Pricing() {
  const [activeTab, setActiveTab] = useState<"cliente" | "prestador">("cliente");

  const handleTabChange = (value: string) => {
    const newTab = value as "cliente" | "prestador";
    setActiveTab(newTab);
    trackPricingToggle(newTab);
  };

  return (
    <section
      className="relative bg-gradient-to-b from-background via-muted/10 to-background py-32"
      id="pricing"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Planos & taxas simples
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sem complicação, sem pegadinhas. Transparência total.
          </p>
        </motion.div>

        {/* Desktop: Side-by-side layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <PricingCard
            type="cliente"
            data={copyData.pricing.cliente}
            index={0}
            icons={clienteIcons}
          />
          <PricingCard
            type="prestador"
            data={copyData.pricing.prestador}
            index={1}
            icons={prestadorIcons}
          />
        </div>

        {/* Mobile: Tabs layout */}
        <div className="lg:hidden max-w-md mx-auto">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="flex justify-center mb-8" role="tablist" aria-label="Selecione o tipo de usuário">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cliente" aria-label="Planos para clientes">
                  Para Clientes
                </TabsTrigger>
                <TabsTrigger value="prestador" aria-label="Planos para prestadores">
                  Para Prestadores
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="cliente" className="mt-0">
              <PricingCard
                type="cliente"
                data={copyData.pricing.cliente}
                index={0}
                icons={clienteIcons}
              />
            </TabsContent>

            <TabsContent value="prestador" className="mt-0">
              <PricingCard
                type="prestador"
                data={copyData.pricing.prestador}
                index={1}
                icons={prestadorIcons}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Comparação rápida */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm text-muted-foreground mb-4">
            ✨ Sem taxas ocultas • ✨ Sem mensalidades • ✨ Sem compromisso
          </p>
        </motion.div>
      </div>
    </section>
  );
}
