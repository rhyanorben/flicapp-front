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
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Users, UserCheck, Clock, CheckCircle } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { User, Mail, Eye } from "lucide-react";
import { useAdminDashboard } from "@/hooks/use-dashboard-data";

interface AdminDashboardProps {
  // Props are now handled by the hook
}

export function AdminDashboard() {
  const { data, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">
          Erro ao carregar dados administrativos
        </p>
      </div>
    );
  }

  // Transformar dados da API para o formato esperado
  const recentActivity = data.providerRequests.recent.map((request) => ({
    id: request.id,
    type: "request_pending",
    title: "Nova solicitação",
    description: `${request.user.name} solicitou tornar-se prestador`,
    timestamp: request.createdAt,
    user: request.user.name,
  }));

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <DashboardFilters />

      {/* Row 1: KPI Cards with Sparklines */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <KpiCard
            label="Total de Usuários"
            value={data.users.total}
            icon={<Users className="h-5 w-5" />}
            trend="up"
            delta={12}
            color="primary"
          />
          <div className="absolute bottom-2 right-2 w-16 h-8">
            <SparklineChart
              data={Object.values(data.users.byMonth)}
              color="#3b82f6"
              height={32}
            />
          </div>
        </div>

        <div className="relative">
          <KpiCard
            label="Prestadores"
            value={data.users.providers}
            icon={<UserCheck className="h-5 w-5" />}
            trend="up"
            delta={8}
            color="success"
          />
          <div className="absolute bottom-2 right-2 w-16 h-8">
            <SparklineChart
              data={Object.values(data.users.byMonth)}
              color="#10b981"
              height={32}
            />
          </div>
        </div>

        <div className="relative">
          <KpiCard
            label="Solicitações Pendentes"
            value={data.providerRequests.pending}
            icon={<Clock className="h-5 w-5" />}
            trend="down"
            delta={-5}
            color="warning"
          />
          <div className="absolute bottom-2 right-2 w-16 h-8">
            <SparklineChart
              data={Object.values(data.providerRequests.byMonth)}
              color="#f59e0b"
              height={32}
            />
          </div>
        </div>

        <div className="relative">
          <KpiCard
            label="Taxa de Aprovação"
            value={Math.round(
              (data.providerRequests.approved / data.providerRequests.total) *
                100
            )}
            icon={<CheckCircle className="h-5 w-5" />}
            trend="up"
            delta={3}
            color="success"
          />
          <div className="absolute bottom-2 right-2 w-16 h-8">
            <SparklineChart
              data={[85, 87, 89, 91, 88, 92]}
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
            <CardTitle>Usuários Cadastrados</CardTitle>
            <CardDescription>
              Tendência de novos usuários nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={Object.entries(data.users.byMonth).map(
                    ([month, value]) => ({ month, users: value })
                  )}
                >
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="users"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorUsers)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stacked Bar Chart */}
        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Solicitações por Status</CardTitle>
            <CardDescription>Distribuição de status por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(data.providerRequests.byMonth).map(
                    ([month, value]) => ({
                      month,
                      pending: Math.floor((value as number) * 0.3),
                      approved: Math.floor((value as number) * 0.6),
                      rejected: Math.floor((value as number) * 0.1),
                    })
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartsTooltip />
                  <Legend />
                  <Bar
                    dataKey="pending"
                    stackId="a"
                    fill="#f59e0b"
                    name="Pendentes"
                  />
                  <Bar
                    dataKey="approved"
                    stackId="a"
                    fill="#10b981"
                    name="Aprovadas"
                  />
                  <Bar
                    dataKey="rejected"
                    stackId="a"
                    fill="#ef4444"
                    name="Rejeitadas"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Row 3: Distribution Charts */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Usuários</CardTitle>
            <CardDescription>Por tipo de usuário</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Clientes",
                        value: data.users.clients,
                        color: "#3b82f6",
                      },
                      {
                        name: "Prestadores",
                        value: data.users.providers,
                        color: "#10b981",
                      },
                      {
                        name: "Administradores",
                        value: data.users.admins,
                        color: "#f59e0b",
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {[
                      {
                        name: "Clientes",
                        value: data.users.clients,
                        color: "#3b82f6",
                      },
                      {
                        name: "Prestadores",
                        value: data.users.providers,
                        color: "#10b981",
                      },
                      {
                        name: "Administradores",
                        value: data.users.admins,
                        color: "#f59e0b",
                      },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {data.users.total?.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Radial Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Aprovação</CardTitle>
            <CardDescription>
              Solicitações aprovadas vs rejeitadas
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
                      name: "Taxa de Aprovação",
                      value: Math.round(
                        (data.providerRequests.approved /
                          data.providerRequests.total) *
                          100
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
                      (data.providerRequests.approved /
                        data.providerRequests.total) *
                        100
                    )}
                    %
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Taxa de Aprovação
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Performance</CardTitle>
            <CardDescription>Indicadores de qualidade e metas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-green-100">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-sm">
                      Taxa de Aprovação
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">87.3%</div>
                    <div className="text-xs text-muted-foreground">
                      Meta: 80%
                    </div>
                  </div>
                </div>
                <Progress value={87.3} className="h-2" />
                <Badge className="bg-green-100 text-green-800">
                  Meta atingida
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-yellow-100">
                      <Clock className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-sm">
                      Solicitações Pendentes
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-yellow-600">5.0%</div>
                    <div className="text-xs text-muted-foreground">
                      Meta: 20%
                    </div>
                  </div>
                </div>
                <Progress value={5} className="h-2" />
                <Badge className="bg-green-100 text-green-800">
                  Meta atingida
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Row 4: Details and Activity */}
      <div className="grid gap-4 xl:grid-cols-12">
        {/* Recent Requests Table */}
        <Card className="xl:col-span-8">
          <CardHeader>
            <CardTitle>Solicitações Recentes</CardTitle>
            <CardDescription>
              Últimas 10 solicitações de prestador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.providerRequests.recent.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {request.user.name}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {request.user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            request.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                              : request.status === "APPROVED"
                              ? "bg-green-100 text-green-800 border-green-300"
                              : "bg-red-100 text-red-800 border-red-300"
                          }
                        >
                          {request.status === "PENDING"
                            ? "Pendente"
                            : request.status === "APPROVED"
                            ? "Aprovada"
                            : "Rejeitada"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {new Date(request.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ver detalhes</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas atividades do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-4">
                {recentActivity.map((activity, index: number) => (
                  <div key={activity.id}>
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                        {activity.type === "user_registered" ? (
                          <User className="h-4 w-4 text-blue-600" />
                        ) : activity.type === "request_approved" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium truncate">
                            {activity.title}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {activity.type === "user_registered"
                              ? "Cadastro"
                              : activity.type === "request_approved"
                              ? "Aprovado"
                              : "Pendente"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {activity.timestamp ? "5m atrás" : "Agora mesmo"}
                          </span>
                          {activity.user && (
                            <span className="text-xs text-muted-foreground">
                              {activity.user}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {index < recentActivity.length - 1 && (
                      <Separator className="mt-4" />
                    )}
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

function AdminDashboardSkeleton() {
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

      {/* Row 2: Main Charts Skeleton */}
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

      {/* Row 3: Distribution Charts Skeleton */}
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

      {/* Row 4: Details and Activity Skeleton */}
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
