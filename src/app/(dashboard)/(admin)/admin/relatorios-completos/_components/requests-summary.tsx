"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  email: string;
}

interface ProviderRequest {
  id: string;
  userId: string;
  user: User;
  status: string;
  createdAt: string;
}

interface RequestsSummaryProps {
  requests: ProviderRequest[];
  requestsByMonth: {
    [month: string]: number;
  };
}

export function RequestsSummary({
  requests,
  requestsByMonth,
}: RequestsSummaryProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-300"
          >
            Pendente
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            Aprovada
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-300"
          >
            Rejeitada
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const months = Object.keys(requestsByMonth);
  const values = Object.values(requestsByMonth);
  const maxValue = Math.max(...values, 1);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Solicitações Recentes</CardTitle>
          <CardDescription>
            Últimas 10 solicitações de prestador
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Nenhuma solicitação encontrada
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.user.name}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {new Date(request.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Solicitações por Mês</CardTitle>
          <CardDescription>
            Distribuição de solicitações nos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {months.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                Nenhum dado disponível
              </div>
            ) : (
              months.map((month, index) => (
                <div key={month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{month}</span>
                    <span className="text-muted-foreground">
                      {values[index]}{" "}
                      {values[index] === 1 ? "solicitação" : "solicitações"}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${(values[index] / maxValue) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
