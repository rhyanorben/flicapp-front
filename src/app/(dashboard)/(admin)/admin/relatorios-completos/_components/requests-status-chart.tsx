"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RequestsStatusChartProps {
  data: {
    [month: string]: number;
  };
  statusData?: {
    [month: string]: {
      pending: number;
      approved: number;
      rejected: number;
    };
  };
}

export function RequestsStatusChart({
  data,
  statusData,
}: RequestsStatusChartProps) {
  // Convert data to chart format
  const chartData = Object.entries(data).map(([month, value]) => ({
    month,
    total: value,
    // Mock status distribution if not provided
    pending: statusData?.[month]?.pending || Math.floor(value * 0.4),
    approved: statusData?.[month]?.approved || Math.floor(value * 0.5),
    rejected: statusData?.[month]?.rejected || Math.floor(value * 0.1),
  }));

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index: number) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                <span className="font-medium">{entry.name}:</span> {entry.value}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="xl:col-span-4">
      <CardHeader>
        <CardTitle>Solicitações por Status</CardTitle>
        <CardDescription>Distribuição de status por mês</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#6b7280" }}
              />
              <YAxis tick={{ fontSize: 12 }} tickLine={{ stroke: "#6b7280" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="pending"
                stackId="a"
                fill="#f59e0b"
                name="Pendentes"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="approved"
                stackId="a"
                fill="#10b981"
                name="Aprovadas"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="rejected"
                stackId="a"
                fill="#ef4444"
                name="Rejeitadas"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-300"
          >
            Pendentes
          </Badge>
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            Aprovadas
          </Badge>
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-300"
          >
            Rejeitadas
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
