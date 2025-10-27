"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  UserPlus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type:
    | "user_registered"
    | "request_approved"
    | "request_rejected"
    | "request_pending"
    | "system_alert";
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

interface ActivityFeedProps {
  activities?: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  // Mock activities if none provided
  const mockActivities: ActivityItem[] = activities || [
    {
      id: "1",
      type: "user_registered",
      title: "Novo usuário cadastrado",
      description: "João Silva se cadastrou como cliente",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      user: "João Silva",
    },
    {
      id: "2",
      type: "request_approved",
      title: "Solicitação aprovada",
      description: "Maria Santos foi aprovada como prestadora",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      user: "Maria Santos",
    },
    {
      id: "3",
      type: "request_pending",
      title: "Nova solicitação",
      description: "Pedro Costa solicitou tornar-se prestador",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      user: "Pedro Costa",
    },
    {
      id: "4",
      type: "user_registered",
      title: "Novo usuário cadastrado",
      description: "Ana Oliveira se cadastrou como cliente",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      user: "Ana Oliveira",
    },
    {
      id: "5",
      type: "request_rejected",
      title: "Solicitação rejeitada",
      description: "Carlos Lima teve sua solicitação rejeitada",
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      user: "Carlos Lima",
    },
    {
      id: "6",
      type: "system_alert",
      title: "Alerta do sistema",
      description: "Alto volume de solicitações pendentes",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_registered":
        return <UserPlus className="h-4 w-4 text-blue-600" />;
      case "request_approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "request_rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "request_pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "system_alert":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "user_registered":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-300"
          >
            Cadastro
          </Badge>
        );
      case "request_approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            Aprovado
          </Badge>
        );
      case "request_rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-300"
          >
            Rejeitado
          </Badge>
        );
      case "request_pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-300"
          >
            Pendente
          </Badge>
        );
      case "system_alert":
        return (
          <Badge
            variant="outline"
            className="bg-orange-100 text-orange-800 border-orange-300"
          >
            Alerta
          </Badge>
        );
      default:
        return <Badge variant="outline">Sistema</Badge>;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Agora mesmo";
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  return (
    <Card className="xl:col-span-4">
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>Últimas atividades do sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {mockActivities.map((activity, index) => (
              <div key={activity.id}>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium truncate">
                        {activity.title}
                      </h4>
                      {getActivityBadge(activity.type)}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {getTimeAgo(activity.timestamp)}
                      </span>
                      {activity.user && (
                        <span className="text-xs text-muted-foreground">
                          {activity.user}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {index < mockActivities.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
