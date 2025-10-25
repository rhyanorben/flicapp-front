"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModernTableProps {
  children: ReactNode;
  className?: string;
  enableAnimations?: boolean;
  useGridLayout?: boolean;
  gridColumns?: string;
}

export function ModernTable({
  children,
  className = "",
  enableAnimations = true,
  useGridLayout = false,
}: ModernTableProps) {
  const shouldReduceMotion = useReducedMotion();

  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1,
      },
    },
  };

  if (useGridLayout) {
    return (
      <div className={cn("w-full h-full", className)}>
        <div className="bg-background border border-border/50 overflow-hidden rounded-lg relative h-full flex flex-col">
          <div className="overflow-x-auto flex-1 min-h-[500px]">
            <div className="min-w-0 w-full h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  variants={shouldAnimate ? containerVariants : {}}
                  initial={shouldAnimate ? "hidden" : "visible"}
                  animate="visible"
                  className="w-full h-full"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="bg-background border border-border/50 overflow-hidden rounded-lg relative">
        <div className="overflow-x-auto">
          <AnimatePresence mode="wait">
            <motion.div
              variants={shouldAnimate ? containerVariants : {}}
              initial={shouldAnimate ? "hidden" : "visible"}
              animate="visible"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface ModernTableRowProps {
  children: ReactNode;
  className?: string;
  isSelected?: boolean;
  onClick?: () => void;
  enableAnimations?: boolean;
  gridColumns?: string;
}

export function ModernTableRow({
  children,
  className = "",
  isSelected = false,
  onClick,
  enableAnimations = true,
  gridColumns,
}: ModernTableRowProps) {
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  const rowVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.98,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
        mass: 0.7,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

  const Component = shouldAnimate ? motion.div : "div";
  const motionProps = shouldAnimate
    ? {
        variants: rowVariants,
        // Removed scale animations to prevent horizontal scroll
      }
    : {};

  return (
    <Component
      {...motionProps}
      className={cn(
        "px-3 py-5 group relative transition-all duration-150 border-b border-border/20 min-h-[70px]",
        isSelected ? "bg-muted/30" : "bg-muted/5 hover:bg-muted/20",
        onClick && "cursor-pointer",
        className
      )}
      style={
        gridColumns
          ? {
              display: "grid",
              gridTemplateColumns: gridColumns,
              columnGap: "0px",
              alignItems: "center",
            }
          : {}
      }
      onClick={onClick}
    >
      {children}
    </Component>
  );
}

interface ModernTableHeaderProps {
  children: ReactNode;
  className?: string;
  gridColumns?: string;
}

export function ModernTableHeader({
  children,
  className = "",
  gridColumns,
}: ModernTableHeaderProps) {
  return (
    <div
      className={cn(
        "px-3 py-5 text-xs font-medium text-muted-foreground/60 bg-muted/5 border-b border-border/30 text-left min-h-[60px]",
        className
      )}
      style={
        gridColumns
          ? {
              display: "grid",
              gridTemplateColumns: gridColumns,
              columnGap: "0px",
            }
          : {}
      }
    >
      {children}
    </div>
  );
}

interface ModernTableCellProps {
  children: ReactNode;
  className?: string;
  borderRight?: boolean;
}

export function ModernTableCell({
  children,
  className = "",
  borderRight = false,
}: ModernTableCellProps) {
  return (
    <div
      className={cn(
        "flex items-center min-w-0",
        borderRight && "border-r border-border/20 pr-3",
        className
      )}
    >
      {children}
    </div>
  );
}
