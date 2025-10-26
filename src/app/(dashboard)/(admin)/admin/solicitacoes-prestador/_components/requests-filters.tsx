"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Users, CheckCircle, XCircle, Clock } from "lucide-react";

interface RequestsFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  counts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export function RequestsFilters({
  currentFilter,
  onFilterChange,
  counts,
}: RequestsFiltersProps) {
  const filters = [
    {
      value: "ALL",
      label: "Todas",
      count: counts.all,
      icon: Users,
      description: "Todas as solicitações",
    },
    {
      value: "PENDING",
      label: "Pendentes",
      count: counts.pending,
      icon: Clock,
      description: "Aguardando análise",
    },
    {
      value: "APPROVED",
      label: "Aprovadas",
      count: counts.approved,
      icon: CheckCircle,
      description: "Aprovadas para prestação",
    },
    {
      value: "REJECTED",
      label: "Rejeitadas",
      count: counts.rejected,
      icon: XCircle,
      description: "Não aprovadas",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Filtrar por status:
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <Button
              key={filter.value}
              variant={currentFilter === filter.value ? "default" : "outline"}
              onClick={() => onFilterChange(filter.value)}
              className="gap-2 h-auto p-3"
              title={filter.description}
            >
              <Icon className="h-4 w-4" />
              <span>{filter.label}</span>
              <Badge
                variant={
                  currentFilter === filter.value ? "secondary" : "outline"
                }
                className="ml-1"
              >
                {filter.count}
              </Badge>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
