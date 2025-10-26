"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, ChevronDown } from "lucide-react";

export function DashboardFilters() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const statusOptions = [
    { value: "all", label: "Todos os Status" },
    { value: "pending", label: "Pendentes" },
    { value: "approved", label: "Aprovadas" },
    { value: "rejected", label: "Rejeitadas" },
  ];

  const getStatusLabel = (value: string) => {
    return (
      statusOptions.find((option) => option.value === value)?.label ||
      "Todos os Status"
    );
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Time Period Tabs */}
          <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <TabsList className="grid w-full grid-cols-3 sm:w-auto">
              <TabsTrigger value="7d">7 dias</TabsTrigger>
              <TabsTrigger value="30d">30 dias</TabsTrigger>
              <TabsTrigger value="90d">90 dias</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2">
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="h-4 w-4 mr-2" />
                  {getStatusLabel(selectedStatus)}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSelectedStatus(option.value)}
                    className={
                      selectedStatus === option.value ? "bg-accent" : ""
                    }
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Custom Date Range */}
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const today = new Date();
                        const weekAgo = new Date(
                          today.getTime() - 7 * 24 * 60 * 60 * 1000
                        );
                        setDateRange({ from: weekAgo, to: today });
                        setSelectedPeriod("custom");
                      }}
                    >
                      Última semana
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const today = new Date();
                        const monthAgo = new Date(
                          today.getTime() - 30 * 24 * 60 * 60 * 1000
                        );
                        setDateRange({ from: monthAgo, to: today });
                        setSelectedPeriod("custom");
                      }}
                    >
                      Último mês
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const today = new Date();
                        const quarterAgo = new Date(
                          today.getTime() - 90 * 24 * 60 * 60 * 1000
                        );
                        setDateRange({ from: quarterAgo, to: today });
                        setSelectedPeriod("custom");
                      }}
                    >
                      Últimos 3 meses
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedPeriod !== "custom" && (
            <Badge variant="secondary" className="text-xs">
              Período:{" "}
              {selectedPeriod === "7d"
                ? "7 dias"
                : selectedPeriod === "30d"
                ? "30 dias"
                : "90 dias"}
            </Badge>
          )}
          {selectedPeriod === "custom" && dateRange.from && dateRange.to && (
            <Badge variant="secondary" className="text-xs">
              Período: {dateRange.from.toLocaleDateString("pt-BR")} -{" "}
              {dateRange.to.toLocaleDateString("pt-BR")}
            </Badge>
          )}
          {selectedStatus !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Status: {getStatusLabel(selectedStatus)}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
