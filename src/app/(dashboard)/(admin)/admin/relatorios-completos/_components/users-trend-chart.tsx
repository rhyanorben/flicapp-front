"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface UsersTrendChartProps {
  data: {
    [month: string]: number;
  };
}

export function UsersTrendChart({ data }: UsersTrendChartProps) {
  // Convert data to chart format
  const chartData = Object.entries(data).map(([month, value]) => ({
    month,
    users: value,
  }));

  // Calculate moving average for trend line
  const calculateMovingAverage = (data: number[], window: number = 2) => {
    return data.map((_, index) => {
      const start = Math.max(0, index - window + 1);
      const slice = data.slice(start, index + 1);
      return slice.reduce((sum, val) => sum + val, 0) / slice.length;
    });
  };

  const userValues = chartData.map((d) => d.users);
  const movingAverage = calculateMovingAverage(userValues);

  const chartDataWithAverage = chartData.map((item, index) => ({
    ...item,
    average: movingAverage[index],
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-blue-600">
              <span className="font-medium">Usuários:</span> {payload[0]?.value}
            </p>
            {payload[1] && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">Média:</span>{" "}
                {payload[1]?.value?.toFixed(1)}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="xl:col-span-8">
      <CardHeader>
        <CardTitle>Usuários Cadastrados</CardTitle>
        <CardDescription>
          Tendência de novos usuários nos últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartDataWithAverage}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#6b7280" }}
              />
              <YAxis tick={{ fontSize: 12 }} tickLine={{ stroke: "#6b7280" }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorUsers)"
                fillOpacity={0.6}
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#6b7280"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
                activeDot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
