"use client";

import { useState } from "react";
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
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import type { DateRange as ReactDayPickerDateRange } from "react-day-picker";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

interface DashboardFiltersProps {
  onPeriodChange?: (period: string) => void;
  onStatusChange?: (status: string) => void;
  onDateRangeChange?: (dateRange: DateRange) => void;
  selectedPeriod?: string;
  selectedStatus?: string;
  dateRange?: DateRange;
}

export function DashboardFilters({
  onPeriodChange,
  onStatusChange,
  onDateRangeChange,
  selectedPeriod = "30d",
  selectedStatus = "all",
  dateRange,
}: DashboardFiltersProps) {
  const [internalDateRange, setInternalDateRange] = useState<DateRange>(
    dateRange || { from: undefined, to: undefined }
  );

  const handlePeriodChange = (period: string) => {
    onPeriodChange?.(period);
    // Clear date range when selecting a predefined period
    if (period !== "custom") {
      setInternalDateRange({ from: undefined, to: undefined });
      onDateRangeChange?.({ from: undefined, to: undefined });
    }
  };

  const handleStatusChange = (status: string) => {
    onStatusChange?.(status);
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (!range) {
      setInternalDateRange({ from: undefined, to: undefined });
      onDateRangeChange?.({ from: undefined, to: undefined });
      return;
    }

    setInternalDateRange(range);
    onDateRangeChange?.(range);
    if (range.from && range.to) {
      handlePeriodChange("custom");
    }
  };

  const handleQuickPeriod = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    const newRange = { from, to };
    setInternalDateRange(newRange);
    onDateRangeChange?.(newRange);
    handlePeriodChange("custom");
  };

  const displayDateRange = () => {
    if (internalDateRange?.from && internalDateRange?.to) {
      return `${format(internalDateRange.from, "dd/MM/yyyy")} - ${format(
        internalDateRange.to,
        "dd/MM/yyyy"
      )}`;
    }
    if (internalDateRange?.from) {
      return `A partir de ${format(internalDateRange.from, "dd/MM/yyyy")}`;
    }
    return "Período personalizado";
  };

  return (
    <div className="flex justify-end">
      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              {selectedStatus === "all"
                ? "Todos os Status"
                : selectedStatus === "pending"
                ? "Pendentes"
                : selectedStatus === "approved"
                ? "Aprovadas"
                : "Rejeitadas"}
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
              {selectedPeriod === "7d"
                ? "7 dias"
                : selectedPeriod === "30d"
                ? "30 dias"
                : selectedPeriod === "90d"
                ? "90 dias"
                : selectedPeriod === "custom"
                ? displayDateRange()
                : "Período"}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Períodos rápidos</p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handlePeriodChange("7d")}
                  >
                    7 dias
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handlePeriodChange("30d")}
                  >
                    30 dias
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handlePeriodChange("90d")}
                  >
                    90 dias
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">
                  Período personalizado
                </p>
                <CalendarComponent
                  mode="range"
                  selected={
                    {
                      from: internalDateRange.from,
                      to: internalDateRange.to,
                    } as ReactDayPickerDateRange
                  }
                  onSelect={(range: ReactDayPickerDateRange | undefined) => {
                    handleDateRangeSelect(
                      range
                        ? {
                            from: range.from,
                            to: range.to,
                          }
                        : undefined
                    );
                  }}
                  numberOfMonths={2}
                />
                <div className="mt-2 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleQuickPeriod(7)}
                  >
                    Última semana
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleQuickPeriod(30)}
                  >
                    Último mês
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleQuickPeriod(90)}
                  >
                    Últimos 3 meses
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
