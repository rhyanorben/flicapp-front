"use client";

import { cn } from "@/lib/utils";
import {
  Sparkles,
  Wrench,
  Hammer,
  Plug,
  Lightbulb,
  MoreHorizontal,
} from "lucide-react";

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const serviceTypes: ServiceType[] = [
  {
    id: "limpeza",
    name: "Limpeza",
    description: "Limpeza doméstica, pós-obra, comercial",
    icon: Sparkles,
  },
  {
    id: "manutencao",
    name: "Manutenção",
    description: "Manutenção preventiva e corretiva",
    icon: Wrench,
  },
  {
    id: "reparo",
    name: "Reparo",
    description: "Consertos e reparos em geral",
    icon: Hammer,
  },
  {
    id: "instalacao",
    name: "Instalação",
    description: "Instalação de equipamentos e sistemas",
    icon: Plug,
  },
  {
    id: "consultoria",
    name: "Consultoria",
    description: "Consultoria técnica e especializada",
    icon: Lightbulb,
  },
  {
    id: "outro",
    name: "Outro",
    description: "Outros serviços",
    icon: MoreHorizontal,
  },
];

interface ServiceTypeCardsProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

export function ServiceTypeCards({
  selectedType,
  onSelect,
}: ServiceTypeCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {serviceTypes.map((service) => {
        const Icon = service.icon;
        const isSelected = selectedType === service.id;

        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onSelect(service.id)}
            className={cn(
              "p-4 rounded-lg border-2 transition-all duration-200 text-left",
              "hover:border-primary/50 hover:shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              isSelected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-input bg-background hover:bg-accent/50"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "p-2 rounded-md transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    "font-medium text-sm transition-colors",
                    isSelected ? "text-primary" : "text-foreground"
                  )}
                >
                  {service.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {service.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
