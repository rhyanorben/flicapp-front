import { KpiCard } from "@/components/ui/kpi-card";
import {
  PieChart,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Star,
} from "lucide-react";

export default function KpiDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">KPI Card Examples</h2>
        <p className="text-muted-foreground">
          Various KPI card configurations and use cases
        </p>
      </div>

      {/* Basic Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCard
            label="Sessions"
            value={6132}
            delta={150}
            trend="up"
            caption="vs Previous 30 Days"
            tone="primary"
            icon={
              <PieChart className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            }
          />
          <KpiCard
            label="Users"
            value={2847}
            delta={-12}
            trend="down"
            caption="vs Last Month"
            tone="success"
            icon={
              <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
            }
          />
          <KpiCard
            label="Conversion"
            value="3.2%"
            delta="+0.5%"
            trend="up"
            caption="vs Previous Period"
            tone="warning"
            icon={
              <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-300" />
            }
          />
        </div>
      </div>

      {/* Different Tones */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Tones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard
            label="Default"
            value={1234}
            tone="default"
            icon={<CheckCircle className="h-4 w-4" />}
          />
          <KpiCard
            label="Primary"
            value={5678}
            tone="primary"
            icon={<PieChart className="h-4 w-4" />}
          />
          <KpiCard
            label="Success"
            value={9012}
            tone="success"
            icon={<CheckCircle className="h-4 w-4" />}
          />
          <KpiCard
            label="Warning"
            value={3456}
            tone="warning"
            icon={<AlertCircle className="h-4 w-4" />}
          />
          <KpiCard
            label="Danger"
            value={7890}
            tone="danger"
            icon={<AlertCircle className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Different Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Sizes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard
            label="Small"
            value={123}
            size="sm"
            tone="primary"
            icon={<Star className="h-3 w-3" />}
          />
          <KpiCard
            label="Medium"
            value={456}
            size="md"
            tone="success"
            icon={<Star className="h-4 w-4" />}
          />
          <KpiCard
            label="Large"
            value={789}
            size="lg"
            tone="warning"
            icon={<Star className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* Compact Mode */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Compact Mode</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Compact 1"
            value={100}
            compact
            tone="primary"
            icon={<CheckCircle className="h-4 w-4" />}
          />
          <KpiCard
            label="Compact 2"
            value={200}
            compact
            tone="success"
            icon={<Users className="h-4 w-4" />}
          />
          <KpiCard
            label="Compact 3"
            value={300}
            compact
            tone="warning"
            icon={<AlertCircle className="h-4 w-4" />}
          />
          <KpiCard
            label="Compact 4"
            value={400}
            compact
            tone="danger"
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Real-world Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Real-world Dashboard Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total Revenue"
            value="$45,231"
            delta={20.1}
            trend="up"
            caption="vs last month"
            tone="success"
            icon={
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
            }
          />
          <KpiCard
            label="Active Users"
            value={2847}
            delta={-5.2}
            trend="down"
            caption="vs last week"
            tone="warning"
            icon={
              <Users className="h-4 w-4 text-amber-600 dark:text-amber-300" />
            }
          />
          <KpiCard
            label="Conversion Rate"
            value="3.2%"
            delta={0.4}
            trend="up"
            caption="vs last month"
            tone="primary"
            icon={
              <PieChart className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            }
          />
          <KpiCard
            label="System Health"
            value="99.9%"
            delta={0.1}
            trend="up"
            caption="uptime"
            tone="success"
            icon={
              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
            }
          />
        </div>
      </div>
    </div>
  );
}
