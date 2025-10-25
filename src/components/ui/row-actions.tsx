"use client";

import { useState, useEffect, useRef } from "react";
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  MessageCircle,
  Download,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface RowAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: "default" | "destructive" | "success";
  disabled?: boolean;
}

interface RowActionsProps {
  actions: RowAction[];
  className?: string;
}

export function RowActions({ actions, className = "" }: RowActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleActionClick = (action: RowAction) => {
    if (!action.disabled) {
      action.onClick();
      setIsOpen(false);
    }
  };

  const getActionIcon = (variant?: string) => {
    switch (variant) {
      case "destructive":
        return "text-red-500";
      case "success":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-muted/50"
      >
        <MoreVertical className="h-4 w-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop para capturar cliques fora */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown com z-index alto */}
          <div className="absolute right-0 top-0 mt-6 w-48 bg-background border border-border/50 shadow-lg rounded-md z-[9999] py-1">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionClick(action);
                }}
                disabled={action.disabled}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors flex items-center gap-2 cursor-pointer",
                  action.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <action.icon
                  className={cn("h-4 w-4", getActionIcon(action.variant))}
                />
                <span
                  className={cn(
                    action.variant === "destructive" && "text-red-600",
                    action.variant === "success" && "text-green-600"
                  )}
                >
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Predefined action icons for common actions
export const ActionIcons = {
  View: Eye,
  Edit: Edit,
  Delete: Trash2,
  Approve: CheckCircle,
  Reject: XCircle,
  Rate: Star,
  Contact: MessageCircle,
  Download: Download,
  Schedule: Calendar,
} as const;
