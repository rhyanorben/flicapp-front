"use client";

import { Button } from "@/components/ui/button";

interface UsersFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  counts: {
    all: number;
    clients: number;
    providers: number;
    admins: number;
  };
}

export function UsersFilters({
  currentFilter,
  onFilterChange,
  counts,
}: UsersFiltersProps) {
  const filters = [
    { label: "Todos", value: "ALL", count: counts.all },
    { label: "Clientes", value: "CLIENTE", count: counts.clients },
    { label: "Prestadores", value: "PRESTADOR", count: counts.providers },
    { label: "Administradores", value: "ADMINISTRADOR", count: counts.admins },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={currentFilter === filter.value ? "default" : "outline"}
          onClick={() => onFilterChange(filter.value)}
          className="gap-2"
        >
          {filter.label}
          <span
            className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
              currentFilter === filter.value
                ? "bg-white/20 text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {filter.count}
          </span>
        </Button>
      ))}
    </div>
  );
}

