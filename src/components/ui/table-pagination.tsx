"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  className?: string;
  enableAnimations?: boolean;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  className = "",
  enableAnimations = true,
}: TablePaginationProps) {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const ButtonComponent = enableAnimations ? motion.button : "button";
  const buttonProps = enableAnimations
    ? {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: { type: "spring" as const, stiffness: 400, damping: 25 },
      }
    : {};

  return (
    <div
      className={cn("mt-4 flex items-center justify-between px-2", className)}
    >
      <div className="text-xs text-muted-foreground/70">
        Página {currentPage} de {totalPages} • {totalItems} itens
      </div>

      <div className="flex gap-1.5">
        <ButtonComponent
          {...buttonProps}
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={cn(
            "px-3 py-1.5 bg-background border border-border/50 text-foreground text-xs hover:bg-muted/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md flex items-center gap-1"
          )}
        >
          <ChevronLeft className="h-3 w-3" />
          Anterior
        </ButtonComponent>

        <ButtonComponent
          {...buttonProps}
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={cn(
            "px-3 py-1.5 bg-background border border-border/50 text-foreground text-xs hover:bg-muted/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md flex items-center gap-1"
          )}
        >
          Próximo
          <ChevronRight className="h-3 w-3" />
        </ButtonComponent>
      </div>
    </div>
  );
}

interface PageNumbersProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  className?: string;
}

export function PageNumbers({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  className = "",
}: PageNumbersProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const half = Math.floor(maxVisiblePages / 2);

    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push("...");
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={cn("flex gap-1", className)}>
      {visiblePages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={typeof page !== "number"}
          className={cn(
            "w-8 h-8 text-xs rounded-md transition-colors",
            typeof page === "number"
              ? page === currentPage
                ? "bg-primary text-primary-foreground"
                : "bg-background border border-border/50 text-foreground hover:bg-muted/30"
              : "text-muted-foreground cursor-default"
          )}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
