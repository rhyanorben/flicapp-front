"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface OrderStats {
  total: number;
  aguardando: number;
  emAndamento: number;
  concluidos: number;
  cancelados: number;
}

export function OrdersOverviewCards() {
  // Dados mockados - em produção viria da API
  const stats: OrderStats = {
    total: 12,
    aguardando: 3,
    emAndamento: 2,
    concluidos: 6,
    cancelados: 1,
  };

  const cards = [
    {
      title: "Total de Pedidos",
      value: stats.total,
      icon: Clock,
      description: "Todos os pedidos",
      color: "text-blue-600",
    },
    {
      title: "Aguardando",
      value: stats.aguardando,
      icon: AlertCircle,
      description: "Aguardando confirmação",
      color: "text-yellow-600",
    },
    {
      title: "Em Andamento",
      value: stats.emAndamento,
      icon: Clock,
      description: "Serviços em execução",
      color: "text-orange-600",
    },
    {
      title: "Concluídos",
      value: stats.concluidos,
      icon: CheckCircle,
      description: "Serviços finalizados",
      color: "text-green-600",
    },
    {
      title: "Cancelados",
      value: stats.cancelados,
      icon: XCircle,
      description: "Pedidos cancelados",
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
