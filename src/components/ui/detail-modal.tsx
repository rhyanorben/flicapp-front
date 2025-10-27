"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  enableAnimations?: boolean;
}

export function DetailModal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  enableAnimations = true,
}: DetailModalProps) {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
      y: 20,
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={enableAnimations ? backdropVariants : {}}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            variants={enableAnimations ? modalVariants : {}}
            initial={enableAnimations ? "hidden" : "visible"}
            animate="visible"
            exit={enableAnimations ? "exit" : "hidden"}
            className={cn(
              "bg-card border border-border rounded-xl p-6 mx-6 shadow-lg relative max-w-4xl w-full max-h-[85vh] overflow-y-auto",
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-muted/50 hover:bg-muted/70 flex items-center justify-center transition-colors"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>

            {title && (
              <h3 className="text-lg font-semibold text-foreground mb-4 pr-8">
                {title}
              </h3>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface DetailModalSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function DetailModalSection({
  title,
  children,
  icon,
  className = "",
}: DetailModalSectionProps) {
  return (
    <div
      className={cn(
        "bg-muted/30 rounded-lg p-4 border border-border/50",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </span>
      </div>
      <div className="text-sm text-foreground font-medium">{children}</div>
    </div>
  );
}

interface DetailModalActionProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "outline" | "destructive";
  className?: string;
}

export function DetailModalAction({
  children,
  onClick,
  variant = "default",
  className = "",
}: DetailModalActionProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full px-4 py-2 rounded-md text-sm font-medium transition-colors",
        variant === "default" &&
          "bg-primary hover:bg-primary/90 text-primary-foreground",
        variant === "outline" &&
          "bg-background border border-border hover:bg-muted text-foreground",
        variant === "destructive" &&
          "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
