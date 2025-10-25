"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

export function RequestsFilters({ currentFilter, onFilterChange, counts }: RequestsFiltersProps) {
  const filters = [
    { value: "ALL", label: "Todas", count: counts.all },
    { value: "PENDING", label: "Pendentes", count: counts.pending },
    { value: "APPROVED", label: "Aprovadas", count: counts.approved },
    { value: "REJECTED", label: "Rejeitadas", count: counts.rejected },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={currentFilter === filter.value ? "default" : "outline"}
          onClick={() => onFilterChange(filter.value)}
          className="gap-2"
        >
          {filter.label}
          <Badge 
            variant={currentFilter === filter.value ? "secondary" : "outline"}
            className="ml-1"
          >
            {filter.count}
          </Badge>
        </Button>
      ))}
    </div>
  );
}

