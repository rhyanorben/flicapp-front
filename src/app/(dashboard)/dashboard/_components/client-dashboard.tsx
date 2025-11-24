"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { KpiCard } from "./shared/kpi-card";
import { SparklineChart } from "./shared/sparkline";
import { DashboardFilters } from "./shared/dashboard-filters";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { ShoppingCart, Clock, Heart, Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";
import { useClientDashboard } from "@/hooks/use-dashboard-data";

// interface ClientDashboardProps {
//   // Props are now handled by the hook
// }

export function ClientDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  const { data, isLoading, error } = useClientDashboard({
    period: selectedPeriod,
    status: selectedStatus === "all" ? undefined : selectedStatus,
    dateFrom: dateRange.from,
    dateTo: dateRange.to,
  });

  if (isLoading) {
    return <ClientDashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">
          Erro ao carregar dados do cliente
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <DashboardFilters
        selectedPeriod={selectedPeriod}
        selectedStatus={selectedStatus}
        dateRange={dateRange}
        onPeriodChange={setSelectedPeriod}
        onStatusChange={setSelectedStatus}
        onDateRangeChange={setDateRange}
      />

      {/* Row 1: KPI Cards with Sparklines */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <KpiCard
            label="Total de Serviços"
            value={data.services.total}
            icon={<ShoppingCart className="h-5 w-5" />}
            trend="up"
            delta={15}
            color="primary"
          />
          <div className="absolute bottom-2 right-2 w-16 h-8">
            <SparklineChart
              data={Object.values(data.monthlyRequests)}
              color="#3b82f6"
              height={32}
            />
          </div>
        </div>

        <div className="relative">
          <KpiCard
            label="Em Andamento"
            value={data.services.inProgress}
            icon={<Clock className="h-5 w-5" />}
            trend="down"
            delta={-8}
            color="warning"
          />
          <div className="absolute bottom-2 right-2 w-16 h-8">
            <SparklineChart
              data={[3, 2, 4, 3, 2, 3]}
              color="#f59e0b"
              height={32}
            />
          </div>
        </div>

        <div className="relative">
          <KpiCard
            label="Favoritos"
            value={data.services.favorites}
            icon={<Heart className="h-5 w-5" />}
            trend="up"
            delta={5}
            color="danger"
          />
          <div className="absolute bottom-2 right-2 w-16 h-8">
            <SparklineChart
              data={[8, 9, 10, 11, 12, 12]}
              color="#ef4444"
              height={32}
            />
          </div>
        </div>

        <div className="relative">
          <KpiCard
            label="Avaliações Pendentes"
            value={data.pendingReviews}
            icon={<Star className="h-5 w-5" />}
            trend="down"
            delta={-12}
            color="success"
          />
          <div className="absolute bottom-2 right-2 w-16 h-8">
            <SparklineChart
              data={[5, 4, 3, 2, 3, 2]}
              color="#10b981"
              height={32}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Row 2: Main Charts */}
      <div className="grid gap-4 xl:grid-cols-12">
        {/* Area Chart */}
        <Card className="xl:col-span-8">
          <CardHeader>
            <CardTitle>Histórico de Solicitações</CardTitle>
            <CardDescription>
              Seus serviços solicitados nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={Object.entries(data.monthlyRequests).map(
                    ([month, value]) => ({ month, requests: value })
                  )}
                >
                  <defs>
                    <linearGradient
                      id="colorRequests"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartsTooltip />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorRequests)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Serviços por Categoria</CardTitle>
            <CardDescription>Distribuição dos seus serviços</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(data.categoriesDistribution).map(
                      ([name, value]) => ({ name, value })
                    )}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {Object.entries(data.categoriesDistribution).map(
                      ([,], index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][index]
                          }
                        />
                      )
                    )}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Row 3: Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Últimos Serviços</CardTitle>
            <CardDescription>Seus pedidos mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentOrders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{order.service}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.provider}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      order.status === "IN_PROGRESS"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {order.status === "IN_PROGRESS"
                      ? "Em Andamento"
                      : order.status === "COMPLETED"
                      ? "Concluído"
                      : "Pendente"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Favorite Providers */}
        <Card>
          <CardHeader>
            <CardTitle>Prestadores Favoritos</CardTitle>
            <CardDescription>Seus prestadores mais contratados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.favoriteProviders.map((provider, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{provider.name}</div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">
                        {provider.rating} • {provider.services} serviços
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Schedules */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
            <CardDescription>Seus serviços agendados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.upcomingSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {schedule.service}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {schedule.provider} • {schedule.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Row 4: Details and Tips */}
      <div className="grid gap-4 xl:grid-cols-12">
        {/* Recent Orders Table */}
        <Card className="xl:col-span-8">
          <CardHeader>
            <CardTitle>Meus Pedidos</CardTitle>
            <CardDescription>
              Histórico completo dos seus serviços
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Prestador</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.service}
                      </TableCell>
                      <TableCell>{order.provider}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            order.status === "IN_PROGRESS"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                              : order.status === "COMPLETED"
                              ? "bg-green-100 text-green-800 border-green-300"
                              : "bg-gray-100 text-gray-800 border-gray-300"
                          }
                        >
                          {order.status === "IN_PROGRESS"
                            ? "Em Andamento"
                            : order.status === "COMPLETED"
                            ? "Concluído"
                            : "Pendente"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Ver detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Tips and Suggestions */}
        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Dicas e Sugestões</CardTitle>
            <CardDescription>Para melhorar sua experiência</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-4">
                {data.tips.map((tip: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 mt-0.5">
                      <span className="text-xs font-medium text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ClientDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filter Bar Skeleton */}
      <Card>
        <CardContent className="p-4">
          <div className="h-10 w-full bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>

      {/* Row 1: KPI Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Row 2: Charts Skeleton */}
      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <CardHeader>
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
        <Card className="xl:col-span-4">
          <CardHeader>
            <div className="h-6 w-40 bg-muted animate-pulse rounded" />
            <div className="h-4 w-56 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-16 w-full bg-muted animate-pulse rounded"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Row 4: Table and Tips Skeleton */}
      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <CardHeader>
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 w-full bg-muted animate-pulse rounded"
                />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="xl:col-span-4">
          <CardHeader>
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
