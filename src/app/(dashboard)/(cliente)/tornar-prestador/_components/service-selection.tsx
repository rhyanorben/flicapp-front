"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Edit2 } from "lucide-react";
import { AsyncSelect } from "@/components/ui/async-select";
import {
  SERVICE_TYPES,
  EXPERIENCE_LEVELS,
  SERVICE_LABELS,
  EXPERIENCE_LABELS,
  type ServiceSelection,
  type ServiceType,
  type ExperienceLevel,
} from "@/lib/types/services";

interface ServiceSelectionProps {
  services: ServiceSelection[];
  onChange: (services: ServiceSelection[]) => void;
  disabled?: boolean;
}

// Mock function to search services
const searchServices = async (
  query?: string,
  excludeServices: ServiceType[] = []
): Promise<ServiceType[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  let filteredServices = SERVICE_TYPES.filter(
    (service) => !excludeServices.includes(service)
  );

  if (query) {
    filteredServices = filteredServices.filter((service) =>
      SERVICE_LABELS[service].toLowerCase().includes(query.toLowerCase())
    );
  }

  return filteredServices;
};

export function ServiceSelection({
  services,
  onChange,
  disabled,
}: ServiceSelectionProps) {
  const [selectedServiceType, setSelectedServiceType] = useState<
    ServiceType | ""
  >("");
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState<
    ExperienceLevel | ""
  >("");
  const [customService, setCustomService] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addService = () => {
    if (!selectedServiceType || !selectedExperienceLevel) return;

    // Check if service already exists (only when not editing the same service)
    if (editingIndex === null) {
      const exists = services.some(
        (s) => s.serviceType === selectedServiceType
      );
      if (exists) return;
    } else {
      // When editing, check if the new service type conflicts with other services
      const otherServices = services.filter(
        (_, index) => index !== editingIndex
      );
      const exists = otherServices.some(
        (s) => s.serviceType === selectedServiceType
      );
      if (exists) return;
    }

    const newService: ServiceSelection = {
      serviceType: selectedServiceType as ServiceType,
      experienceLevel: selectedExperienceLevel as ExperienceLevel,
      customService:
        selectedServiceType === "outros" ? customService : undefined,
    };

    if (editingIndex !== null) {
      // Update existing service
      const newServices = [...services];
      newServices[editingIndex] = newService;
      onChange(newServices);
      setEditingIndex(null);
    } else {
      // Add new service
      onChange([...services, newService]);
    }

    // Reset form
    setSelectedServiceType("");
    setSelectedExperienceLevel("");
    setCustomService("");
  };

  const removeService = (index: number) => {
    const newServices = services.filter((_, i) => i !== index);
    onChange(newServices);
  };

  const editService = (index: number) => {
    const service = services[index];
    setSelectedServiceType(service.serviceType);
    setSelectedExperienceLevel(service.experienceLevel);
    setCustomService(service.customService || "");
    setEditingIndex(index);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setSelectedServiceType("");
    setSelectedExperienceLevel("");
    setCustomService("");
  };

  const isFormValid =
    selectedServiceType &&
    selectedExperienceLevel &&
    (selectedServiceType !== "outros" || customService.trim());

  return (
    <div className="space-y-6">
      {/* Service Selection Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {editingIndex !== null ? "Editar Serviço" : "Adicionar Serviço"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Serviço *</Label>
              <AsyncSelect<ServiceType>
                fetcher={(query) => {
                  // Exclude all services except the one being edited
                  const excludeServices =
                    editingIndex !== null
                      ? services
                          .filter((_, index) => index !== editingIndex)
                          .map((s) => s.serviceType)
                      : services.map((s) => s.serviceType);
                  return searchServices(query, excludeServices);
                }}
                renderOption={(service) => (
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{SERVICE_LABELS[service]}</div>
                  </div>
                )}
                getOptionValue={(service) => service}
                getDisplayValue={(service) => SERVICE_LABELS[service]}
                label="Serviço"
                placeholder="Buscar serviço..."
                value={selectedServiceType}
                onChange={(value) =>
                  setSelectedServiceType(value as ServiceType | "")
                }
                disabled={disabled}
                width="100%"
                noResultsMessage="Nenhum serviço encontrado"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience-level">Nível de Experiência *</Label>
              <select
                id="experience-level"
                value={selectedExperienceLevel}
                onChange={(e) =>
                  setSelectedExperienceLevel(
                    e.target.value as ExperienceLevel | ""
                  )
                }
                disabled={disabled}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="">Selecione o nível</option>
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {EXPERIENCE_LABELS[level]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedServiceType === "outros" && (
            <div className="space-y-2">
              <Label htmlFor="custom-service">Especifique o serviço *</Label>
              <Input
                id="custom-service"
                placeholder="Digite o tipo de serviço que você oferece"
                value={customService}
                onChange={(e) => setCustomService(e.target.value)}
                disabled={disabled}
                maxLength={100}
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={addService}
              disabled={!isFormValid || disabled}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              {editingIndex !== null
                ? "Atualizar Serviço"
                : "Adicionar Serviço"}
            </Button>
            {editingIndex !== null && (
              <Button
                type="button"
                variant="outline"
                onClick={cancelEdit}
                disabled={disabled}
              >
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Services */}
      {services.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Serviços Selecionados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-md"
                >
                  <div className="flex-1">
                    <div className="font-medium">
                      {service.serviceType === "outros" && service.customService
                        ? service.customService
                        : SERVICE_LABELS[service.serviceType]}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {EXPERIENCE_LABELS[service.experienceLevel]}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => editService(index)}
                      disabled={disabled || editingIndex !== null}
                      className="text-primary hover:text-primary"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeService(index)}
                      disabled={disabled}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
