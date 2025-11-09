"use client";

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
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Inbox, CheckCircle, Star, Target } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User } from "lucide-react";
import { useProviderDashboard } from "@/hooks/use-dashboard-data";

export function ProviderDashboard() {
  const { data, isLoading, error } = useProviderDashboard();

  if (isLoading) {
    return <ProviderDashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">
          Erro ao carregar dados do prestador
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <DashboardFilters />

      {/* Row 1: KPI Cards with Sparklines */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <KpiCard
            label="Solicitações Recebidas"
            value={data.requests.total}
            icon={<Inbox className="h-5 w-5" />}
            trend="up"
            delta={18}
            color="primary"
          />
          <div className="absolute bottom-2 right-2 w-16 h-8">
            <SparklineChart
              data={Object.values(data.monthlyTrend)}
              color="#3b82f6"
              height={32}
            />
          </div>
        </div>

        <div className="relative">
          <KpiCard
            label="Serviços Concluídos"
            value={data.requests.completed}
            icon={<CheckCircle className="h-5 w-5" />}
            trend="up"
            delta={12}
            color="success"
          />
          <div className="absolute bottom-2 right-2 w-16 h-8">
            <SparklineChart
              data={[85, 88, 92, 89, 95, 91]}
              color="#10b981"
              height={32}
            />
          </div>
        </div>

        <div className="relative">
          <KpiCard
            label="Avaliação Média"
            value={data.rating}
            icon={<Star className="h-5 w-5" />}
            trend="up"
            delta={2}
            color="warning"
          />
          <div className="absolute bottom-2 right-2 w-16 h-8">
            <SparklineChart
              data={[4.5, 4.6, 4.7, 4.8, 4.7, 4.8]}
              color="#f59e0b"
              height={32}
            />
          </div>
        </div>

        <div className="relative">
          <KpiCard
            label="Taxa de Aceitação"
            value={data.acceptanceRate}
            icon={<Target className="h-5 w-5" />}
            trend="up"
            delta={5}
            color="success"
          />
          <div className="absolute bottom-2 right-2 w-16 h-8">
            <SparklineChart
              data={[80, 82, 85, 83, 87, 85]}
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
            <CardTitle>Tendência de Solicitações</CardTitle>
            <CardDescription>
              Solicitações recebidas nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={Object.entries(data.monthlyTrend).map(
                    ([month, value]) => ({ month, requests: value })
                  )}
                >
                  <defs>
                    <linearGradient
                      id="colorProviderRequests"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#10b981"
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
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorProviderRequests)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Status das Solicitações</CardTitle>
            <CardDescription>Distribuição por status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      status: "Pendentes",
                      count: data.requests.pending,
                      color: "#f59e0b",
                    },
                    {
                      status: "Aceitas",
                      count: data.requests.accepted,
                      color: "#10b981",
                    },
                    {
                      status: "Concluídas",
                      count: data.requests.completed,
                      color: "#3b82f6",
                    },
                    {
                      status: "Canceladas",
                      count: data.requests.rejected,
                      color: "#ef4444",
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Row 3: Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Completion Rate Radial */}
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Conclusão</CardTitle>
            <CardDescription>
              Percentual de serviços finalizados
            </CardDescription>
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
                  data={[
                    {
                      name: "Taxa de Conclusão",
                      value: Math.round(
                        (data.requests.completed / data.requests.accepted) * 100
                      ),
                      fill: "#10b981",
                    },
                  ]}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar dataKey="value" cornerRadius={10} fill="#10b981" />
                </RadialBarChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round(
                      (data.requests.completed / data.requests.accepted) * 100
                    )}
                    %
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Taxa de Conclusão
                  </div>
                </div>
              </div>
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
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {schedule.client} • {schedule.time}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {schedule.address}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Metas do Mês</CardTitle>
            <CardDescription>Seus objetivos mensais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Serviços</span>
                  <span className="text-sm text-muted-foreground">
                    {data.monthlyGoals.services.current}/
                    {data.monthlyGoals.services.target}
                  </span>
                </div>
                <Progress
                  value={data.monthlyGoals.services.percentage}
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground">
                  {data.monthlyGoals.services.percentage}% da meta
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Avaliação</span>
                  <span className="text-sm text-muted-foreground">
                    {data.monthlyGoals.rating.current}/
                    {data.monthlyGoals.rating.target}
                  </span>
                </div>
                <Progress
                  value={data.monthlyGoals.rating.percentage}
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground">
                  {data.monthlyGoals.rating.percentage}% da meta
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Conclusão</span>
                  <span className="text-sm text-muted-foreground">
                    {data.monthlyGoals.completion.current}%
                  </span>
                </div>
                <Progress
                  value={data.monthlyGoals.completion.percentage}
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground">
                  {data.monthlyGoals.completion.percentage}% da meta
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Row 4: Details and Reviews */}
      <div className="grid gap-4 xl:grid-cols-12">
        {/* Recent Requests Table */}
        <Card className="xl:col-span-8">
          <CardHeader>
            <CardTitle>Solicitações Recentes</CardTitle>
            <CardDescription>Últimas solicitações recebidas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {request.client.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {request.client.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{request.service}</div>
                        <div className="text-sm text-muted-foreground">
                          {request.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            request.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                              : request.status === "ACCEPTED"
                              ? "bg-green-100 text-green-800 border-green-300"
                              : "bg-blue-100 text-blue-800 border-blue-300"
                          }
                        >
                          {request.status === "PENDING"
                            ? "Pendente"
                            : request.status === "ACCEPTED"
                            ? "Aceita"
                            : "Concluída"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(request.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Responder
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Avaliações Recebidas</CardTitle>
            <CardDescription>Últimas avaliações dos clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-4">
                {data.recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex items-start gap-3 p-3 rounded-lg border"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {review.client}
                        </span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {review.comment}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
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

function ProviderDashboardSkeleton() {
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
              <div className="h-64 w-full bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Row 4: Table and Reviews Skeleton */}
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
