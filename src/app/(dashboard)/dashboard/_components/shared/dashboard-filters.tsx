"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Filter, Calendar, ChevronDown } from "lucide-react";

interface DashboardFiltersProps {
  onPeriodChange?: (period: string) => void;
  onStatusChange?: (status: string) => void;
  onDateRangeChange?: (range: { from: Date; to: Date }) => void;
}

export function DashboardFilters({
  onPeriodChange,
  onStatusChange,
  onDateRangeChange,
}: DashboardFiltersProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    onStatusChange?.(status);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Tabs value={selectedPeriod} onValueChange={handlePeriodChange}>
        <TabsList className="grid w-full grid-cols-3 sm:w-auto">
          <TabsTrigger value="7d">7 dias</TabsTrigger>
          <TabsTrigger value="30d">30 dias</TabsTrigger>
          <TabsTrigger value="90d">90 dias</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Todos os Status
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleStatusChange("all")}>
              Todos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
              Pendentes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("approved")}>
              Aprovadas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("rejected")}>
              Rejeitadas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Calendar className="h-4 w-4 mr-2" />
              Período personalizado
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Selecione um período personalizado
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  Última semana
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Último mês
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
