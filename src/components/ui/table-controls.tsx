"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  Download,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SortOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface TableControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  sortOptions?: SortOption[];
  currentSort?: string;
  onSortChange?: (value: string) => void;
  filterOptions?: FilterOption[];
  currentFilter?: string;
  onFilterChange?: (value: string) => void;
  onExportCSV?: () => void;
  onExportJSON?: () => void;
  className?: string;
}

export function TableControls({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  sortOptions = [],
  currentSort,
  onSortChange,
  filterOptions = [],
  currentFilter,
  onFilterChange,
  onExportCSV,
  onExportJSON,
  className = "",
}: TableControlsProps) {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleSort = (value: string) => {
    onSortChange?.(value);
    setShowSortMenu(false);
  };

  const handleFilter = (value: string) => {
    onFilterChange?.(value);
    setShowFilterMenu(false);
  };

  const handleExportCSV = () => {
    onExportCSV?.();
    setShowExportMenu(false);
  };

  const handleExportJSON = () => {
    onExportJSON?.();
    setShowExportMenu(false);
  };

  return (
    <div
      className={cn(
        "mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Filter Dropdown */}
        {filterOptions.length > 0 && (
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={cn(
                "px-3 py-1.5 text-sm hover:bg-muted/30 transition-colors flex items-center gap-2",
                currentFilter && "ring-2 ring-primary/30"
              )}
            >
              <Filter className="h-4 w-4" />
              Filtrar
              {currentFilter && (
                <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-sm px-1.5 py-0.5">
                  1
                </span>
              )}
            </Button>

            <AnimatePresence>
              {showFilterMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowFilterMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-1 w-44 bg-background border border-border/50 shadow-lg rounded-md z-20 py-1"
                  >
                    <button
                      onClick={() => handleFilter("")}
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors",
                        !currentFilter && "bg-muted/30"
                      )}
                    >
                      All
                    </button>
                    <div className="h-px bg-border/30 my-1" />
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleFilter(option.value)}
                        className={cn(
                          "w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors flex items-center gap-2",
                          currentFilter === option.value && "bg-muted/30"
                        )}
                      >
                        {option.label}
                        {option.count !== undefined && (
                          <span className="ml-auto text-xs text-muted-foreground">
                            {option.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Sort Dropdown */}
        {sortOptions.length > 0 && (
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="px-3 py-1.5 text-sm hover:bg-muted/30 transition-colors flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              Organizar
              {currentSort && (
                <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-sm px-1.5 py-0.5">
                  1
                </span>
              )}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>

            <AnimatePresence>
              {showSortMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSortMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-1 w-48 bg-background border border-border/50 shadow-lg rounded-md z-20 py-1"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSort(option.value)}
                        className={cn(
                          "w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors flex items-center gap-2",
                          currentSort === option.value && "bg-muted/30"
                        )}
                      >
                        {option.icon}
                        {option.label}
                        {currentSort === option.value && (
                          <span className="ml-auto text-xs text-muted-foreground">
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Export Dropdown */}
        {(onExportCSV || onExportJSON) && (
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3 py-1.5 text-sm hover:bg-muted/30 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>

            <AnimatePresence>
              {showExportMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowExportMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-1 w-32 bg-background border border-border/50 shadow-lg rounded-md z-20"
                  >
                    {onExportCSV && (
                      <button
                        onClick={handleExportCSV}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
                      >
                        CSV
                      </button>
                    )}
                    {onExportJSON && (
                      <button
                        onClick={handleExportJSON}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors flex items-center gap-2 border-t border-border/30"
                      >
                        JSON
                      </button>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
  className = "",
}: SearchInputProps) {
  return (
    <div className={cn("relative flex-1", className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
