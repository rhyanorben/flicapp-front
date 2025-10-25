"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Shield, FileText } from "lucide-react";

interface OverviewCardsProps {
  data: {
    users: {
      total: number;
      admins: number;
      providers: number;
      clients: number;
    };
    providerRequests: {
      total: number;
      pending: number;
      approved: number;
      rejected: number;
    };
  };
}

export function OverviewCards({ data }: OverviewCardsProps) {
  const cards = [
    {
      title: "Total de Usuários",
      value: data.users.total,
      icon: Users,
      description: "Usuários cadastrados no sistema",
    },
    {
      title: "Clientes",
      value: data.users.clients,
      icon: Users,
      description: "Usuários com role de cliente",
    },
    {
      title: "Prestadores",
      value: data.users.providers,
      icon: UserCheck,
      description: "Usuários com role de prestador",
    },
    {
      title: "Administradores",
      value: data.users.admins,
      icon: Shield,
      description: "Usuários com role de administrador",
    },
    {
      title: "Solicitações Pendentes",
      value: data.providerRequests.pending,
      icon: FileText,
      description: "Aguardando revisão",
    },
    {
      title: "Solicitações Aprovadas",
      value: data.providerRequests.approved,
      icon: FileText,
      description: "Total de aprovações",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
