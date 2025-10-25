"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UsersChartProps {
  data: {
    [month: string]: number;
  };
}

export function UsersChart({ data }: UsersChartProps) {
  const months = Object.keys(data);
  const values = Object.values(data);
  const maxValue = Math.max(...values, 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuários Cadastrados</CardTitle>
        <CardDescription>
          Novos usuários cadastrados nos últimos 6 meses
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
                    {values[index] === 1 ? "usuário" : "usuários"}
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
  );
}
