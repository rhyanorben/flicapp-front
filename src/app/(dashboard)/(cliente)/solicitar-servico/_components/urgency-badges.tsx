"use client";

import { cn } from "@/lib/utils";
import { Clock, CheckCircle } from "lucide-react";

export interface UrgencyLevel {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
}

const urgencyLevels: UrgencyLevel[] = [
  {
    id: "baixa",
    label: "Baixa",
    description: "Resposta em até 72h",
    icon: Clock,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
  },
  {
    id: "normal",
    label: "Normal",
    description: "Resposta em 24-48h",
    icon: Clock,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    id: "alta",
    label: "Alta",
    description: "Tentaremos responder hoje",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
];

interface UrgencyBadgesProps {
  selectedUrgency: string;
  onSelect: (urgency: string) => void;
}

export function UrgencyBadges({
  selectedUrgency,
  onSelect,
}: UrgencyBadgesProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {urgencyLevels.map((urgency) => {
        const Icon = urgency.icon;
        const isSelected = selectedUrgency === urgency.id;

        return (
          <button
            key={urgency.id}
            type="button"
            onClick={() => onSelect(urgency.id)}
            className={cn(
              "relative p-4 rounded-lg border-2 transition-all duration-200 text-left",
              "hover:shadow-md hover:scale-[1.02]",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              isSelected
                ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                : `border-input bg-background hover:bg-accent/50 ${urgency.borderColor}`
            )}
          >
            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
            )}

            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "p-2 rounded-md transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : `${urgency.bgColor} ${urgency.color}`
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    "font-semibold text-sm transition-colors",
                    isSelected ? "text-primary" : "text-foreground"
                  )}
                >
                  {urgency.label}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {urgency.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
