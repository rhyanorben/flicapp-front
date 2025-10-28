"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OverviewCards } from "./_components/overview-cards";
import { DashboardFilters } from "./_components/dashboard-filters";
import { UsersTrendChart } from "./_components/users-trend-chart";
import { RequestsStatusChart } from "./_components/requests-status-chart";
import { UserDistributionDonut } from "./_components/user-distribution-donut";
import { ApprovalRateRadial } from "./_components/approval-rate-radial";
import { MetricsProgress } from "./_components/metrics-progress";
import { RecentRequestsTable } from "./_components/recent-requests-table";
import { ActivityFeed } from "./_components/activity-feed";
import { Separator } from "@/components/ui/separator";
import { useAdminStatistics } from "@/hooks/use-admin-statistics";

function RelatoriosCompletosData() {
  const router = useRouter();

  // Filter states
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // Build filters object
  const filters = {
    period: selectedPeriod,
    status: selectedStatus,
    dateRange: dateRange.from && dateRange.to ? dateRange : undefined,
  };

  // Use the new hook with filters
  const { data: statistics, isLoading, error } = useAdminStatistics(filters);

  // Filter handlers
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    // Reset date range when changing period
    if (period !== "custom") {
      setDateRange({ from: undefined, to: undefined });
    }
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleDateRangeChange = (newDateRange: {
    from: Date | undefined;
    to: Date | undefined;
  }) => {
    setDateRange(newDateRange);
  };

  // Handle 403 redirect
  if (error?.message === "Acesso negado") {
    router.push("/dashboard");
  }

  if (isLoading) {
    return <RelatoriosCompletosDataSkeleton />;
  }

  if (!statistics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Erro ao carregar estatísticas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <DashboardFilters
        onPeriodChange={handlePeriodChange}
        onStatusChange={handleStatusChange}
        onDateRangeChange={handleDateRangeChange}
      />

      {/* Row 1: KPI Cards with Sparklines */}
      <OverviewCards data={statistics} />

      <Separator />

      {/* Row 2: Main Charts */}
      <div className="grid gap-4 xl:grid-cols-12">
        <UsersTrendChart data={statistics.users.byMonth} />
        <RequestsStatusChart
          data={statistics.providerRequests.byMonth}
          statusData={statistics.providerRequests.byStatusAndMonth}
        />
      </div>

      <Separator />

      {/* Row 3: Distribution Charts */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <UserDistributionDonut data={statistics.users} />
        <ApprovalRateRadial data={statistics.providerRequests} />
        <MetricsProgress data={statistics} />
      </div>

      <Separator />

      {/* Row 4: Details and Activity */}
      <div className="grid gap-4 xl:grid-cols-12">
        <RecentRequestsTable requests={statistics.providerRequests.recent} />
        <ActivityFeed activities={statistics.activities} />
      </div>
    </div>
  );
}

function RelatoriosCompletosDataSkeleton() {
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

export default function RelatoriosCompletosPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Relatórios Completos</CardTitle>
          <CardDescription>
            Visão geral detalhada de usuários, serviços e estatísticas do
            sistema
          </CardDescription>
        </CardHeader>
      </Card>
      <RelatoriosCompletosData />
    </div>
  );
}
