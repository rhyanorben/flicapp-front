"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  trend?: "up" | "down" | "flat";
  delta?: number;
  color?: "primary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
}

export function KpiCard({
  label,
  value,
  icon,
  trend,
  delta,
  color = "primary",
  size = "md",
}: KpiCardProps) {
  const colorClasses = {
    primary:
      "bg-blue-100/70 dark:bg-blue-900/30 ring-1 ring-blue-200/60 dark:ring-blue-800/60",
    success:
      "bg-emerald-100/70 dark:bg-emerald-900/30 ring-1 ring-emerald-200/60 dark:ring-emerald-800/60",
    warning:
      "bg-amber-100/70 dark:bg-amber-900/30 ring-1 ring-amber-200/60 dark:ring-amber-800/60",
    danger:
      "bg-rose-100/70 dark:bg-rose-900/30 ring-1 ring-rose-200/60 dark:ring-rose-800/60",
  };

  const sizeClasses = {
    sm: "min-h-[80px] p-3",
    md: "min-h-[92px] p-4",
    lg: "min-h-[104px] p-5",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-sm ${sizeClasses[size]} ${colorClasses[color]}`}
    >
      <span className="pointer-events-none absolute -right-6 -top-6 inline-flex h-16 w-16 rounded-full bg-black/5 dark:bg-white/5" />
      <span className="pointer-events-none absolute -right-2 -top-2 inline-flex h-8 w-8 rounded-full bg-black/5 dark:bg-white/5" />

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {label}
          </div>
          <div className="text-2xl font-semibold tracking-tight">
            {value?.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {delta && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                trend === "up"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : trend === "down"
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4" />
              ) : trend === "down" ? (
                <TrendingDown className="h-4 w-4" />
              ) : (
                <div className="h-4 w-4" />
              )}
              {delta > 0 ? "+" : ""}
              {delta}%
            </div>
          )}
          <div className="rounded-full bg-white/40 p-1 dark:bg-white/10 h-5 w-5">
            {icon}
          </div>
        </div>
      </div>

      <div className="bg-current/40 mt-3 h-0.5 w-16 rounded opacity-60" />
    </div>
  );
}
