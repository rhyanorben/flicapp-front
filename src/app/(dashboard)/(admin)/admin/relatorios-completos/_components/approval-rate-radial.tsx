"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadialBarChart, RadialBar, ResponsiveContainer, Cell } from "recharts";

interface ApprovalRateRadialProps {
  data: {
    approved: number;
    rejected: number;
  };
}

export function ApprovalRateRadial({ data }: ApprovalRateRadialProps) {
  const total = data.approved + data.rejected;
  const approvalRate = total > 0 ? (data.approved / total) * 100 : 0;

  const chartData = [
    {
      name: "Taxa de Aprovação",
      value: approvalRate,
      fill:
        approvalRate >= 70
          ? "#10b981"
          : approvalRate >= 50
          ? "#f59e0b"
          : "#ef4444",
    },
  ];

  const getStatusColor = (rate: number) => {
    if (rate >= 70) return "success";
    if (rate >= 50) return "warning";
    return "destructive";
  };

  const getStatusLabel = (rate: number) => {
    if (rate >= 70) return "Excelente";
    if (rate >= 50) return "Bom";
    return "Precisa melhorar";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Taxa de Aprovação</CardTitle>
        <CardDescription>Solicitações aprovadas vs rejeitadas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="90%"
              barSize={20}
              data={chartData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={10}
                fill={chartData[0].fill}
              />
            </RadialBarChart>
          </ResponsiveContainer>

          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div
                className="text-3xl font-bold"
                style={{ color: chartData[0].fill }}
              >
                {approvalRate.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Taxa de Aprovação
              </div>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-center mt-4">
          <Badge
            variant={
              getStatusColor(approvalRate) === "success"
                ? "default"
                : getStatusColor(approvalRate) === "warning"
                ? "secondary"
                : "destructive"
            }
            className="text-xs"
          >
            {getStatusLabel(approvalRate)}
          </Badge>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mt-4 text-center">
          <div>
            <div className="text-lg font-semibold text-green-600">
              {data.approved}
            </div>
            <div className="text-xs text-muted-foreground">Aprovadas</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-red-600">
              {data.rejected}
            </div>
            <div className="text-xs text-muted-foreground">Rejeitadas</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
