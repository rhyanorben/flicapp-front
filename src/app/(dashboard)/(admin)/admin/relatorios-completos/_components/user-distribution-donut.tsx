"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface UserDistributionDonutProps {
  data: {
    total: number;
    admins: number;
    providers: number;
    clients: number;
  };
}

export function UserDistributionDonut({ data }: UserDistributionDonutProps) {
  const chartData = [
    { name: "Clientes", value: data.clients, color: "#3b82f6" },
    { name: "Prestadores", value: data.providers, color: "#10b981" },
    { name: "Administradores", value: data.admins, color: "#f59e0b" },
  ].filter((item) => item.value > 0);

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      payload: {
        color: string;
      };
    }>;
  }

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = chartData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(1);

      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.payload.color }}
            />
            <p className="font-medium">{data.name}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            {data.value} usuários ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Usuários</CardTitle>
        <CardDescription>Por tipo de usuário</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Center total */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {data.total.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mt-4">
          {chartData.map((item, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs"
              style={{
                borderColor: item.color,
                color: item.color,
              }}
            >
              {item.name}: {item.value}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
