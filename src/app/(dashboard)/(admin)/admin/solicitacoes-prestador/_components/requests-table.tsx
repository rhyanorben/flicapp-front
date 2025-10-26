"use client";

import { useState, useMemo } from "react";
import {
  Eye,
  FileText,
  User,
  Calendar,
  CheckCircle,
  Clock,
  Building,
  Phone,
  MapPin,
  Hash,
  Check,
  X,
  Loader2,
} from "lucide-react";
import {
  GenericTable,
  TableColumn,
  TableAction,
} from "@/components/ui/generic-table";
import { DetailModalSection } from "@/components/ui/detail-modal";
import { Badge } from "@/components/ui/badge";
import { RequestDetailsDialog } from "./request-details-dialog";

interface User {
  id: string;
  name: string;
  email: string;
}

interface ServiceSelection {
  serviceType: string;
  experienceLevel: string;
  customService?: string;
}

interface ProviderRequest {
  id: string;
  userId: string;
  user: User;
  services?: ServiceSelection[];
  description: string;
  experience: string;
  phone: string;
  cep?: string;
  address: string;
  documentNumber: string;
  portfolioLinks?: string | null;
  portfolioLinksJson?: Array<{ url: string; title: string }> | null;
  status: string;
  reviewedBy: string | null;
  reviewedByUser: User | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface RequestsTableProps {
  requests: ProviderRequest[];
  onRequestUpdate: () => void;
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  isUpdating?: boolean;
}

export function RequestsTable({
  requests,
  onRequestUpdate,
  onApproveRequest,
  onRejectRequest,
  isUpdating = false,
}: RequestsTableProps) {
  const [selectedRequest, setSelectedRequest] =
    useState<ProviderRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800"
          >
            Pendente
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800"
          >
            Aprovada
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800"
          >
            Rejeitada
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getServiceLabel = (serviceType: string) => {
    const serviceLabels: Record<string, string> = {
      eletricista: "Eletricista",
      encanador: "Encanador",
      "limpeza-residencial": "Limpeza Residencial",
      "suporte-de-informatica": "Suporte de Informática",
      "montador-de-moveis": "Montador de Móveis",
      chaveiro: "Chaveiro",
      pintor: "Pintor",
      "pedreiro-reforma": "Pedreiro/Reforma",
      marceneiro: "Marceneiro",
      jardinagem: "Jardinagem",
      piscineiro: "Piscineiro",
      dedetizacao: "Dedetização",
      gesseiro: "Gesseiro",
      serralheiro: "Serralheiro",
      vidraceiro: "Vidraceiro",
      "instalador-ar-condicionado": "Instalador de Ar Condicionado",
      "manutencao-eletrodomesticos": "Manutenção de Eletrodomésticos",
      "mecanico-automotivo": "Mecânico Automotivo",
      "funilaria-automotiva": "Funilaria Automotiva",
      "transporte-frete": "Transporte/Frete",
      "mudanca-carretos": "Mudança/Carretos",
      "cuidador-idosos": "Cuidador de Idosos",
      baba: "Baba",
      "professor-particular": "Professor Particular",
      "personal-trainer": "Personal Trainer",
      "fotografo-filmagem": "Fotógrafo/Filmagem",
      "designer-grafico": "Designer Gráfico",
      cabeleireiro: "Cabeleireiro",
      "manicure-pedicure": "Manicure/Pedicure",
      maquiagem: "Maquiagem",
      buffet: "Buffet",
      "dj-som": "DJ/Som",
      "decoracao-eventos": "Decoração de Eventos",
      outros: "Outros",
    };

    return serviceLabels[serviceType] || serviceType;
  };

  // Configuração das colunas
  const columns: TableColumn[] = useMemo(
    () => [
      {
        key: "user.name",
        label: "Solicitante",
        sortable: true,
        render: (value: unknown, row: Record<string, unknown>) => {
          const request = row as unknown as ProviderRequest;
          return (
            <div className="space-y-1">
              <p className="font-medium">{request.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {request.user.email}
              </p>
            </div>
          );
        },
      },
      {
        key: "services",
        label: "Serviços",
        render: (value: unknown, row: Record<string, unknown>) => {
          const request = row as unknown as ProviderRequest;
          return (
            <div className="space-y-1">
              {request.services && request.services.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {request.services.slice(0, 2).map((service, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {service.serviceType === "outros" && service.customService
                        ? service.customService
                        : getServiceLabel(service.serviceType)}
                    </Badge>
                  ))}
                  {request.services.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{request.services.length - 2} mais
                    </Badge>
                  )}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">N/A</span>
              )}
            </div>
          );
        },
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        render: (value: unknown, row: Record<string, unknown>) => {
          const request = row as unknown as ProviderRequest;
          return getStatusBadge(request.status);
        },
      },
      {
        key: "createdAt",
        label: "Data da Solicitação",
        sortable: true,
        render: (value: unknown, row: Record<string, unknown>) => {
          const request = row as unknown as ProviderRequest;
          return (
            <div className="text-sm">
              {new Date(request.createdAt).toLocaleDateString("pt-BR")}
              <p className="text-xs text-muted-foreground">
                {new Date(request.createdAt).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          );
        },
      },
      {
        key: "reviewedAt",
        label: "Data de Revisão",
        sortable: true,
        render: (value: unknown, row: Record<string, unknown>) => {
          const request = row as unknown as ProviderRequest;
          return request.reviewedAt ? (
            <div className="text-sm">
              {new Date(request.reviewedAt).toLocaleDateString("pt-BR")}
              <p className="text-xs text-muted-foreground">
                {new Date(request.reviewedAt).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          );
        },
      },
    ],
    []
  );

  // Ações customizadas
  const customActions: TableAction[] = useMemo(
    () => [
      {
        id: "view",
        label: "Ver Detalhes",
        icon: ({ className }) => <Eye className={className} />,
        onClick: (row: Record<string, unknown>) => {
          const request = row as unknown as ProviderRequest;
          setSelectedRequest(request);
          setIsDialogOpen(true);
        },
        variant: "default",
      },
      {
        id: "approve",
        label: "Aprovar",
        icon: ({ className }) =>
          isUpdating ? (
            <Loader2 className={`${className} animate-spin`} />
          ) : (
            <Check className={className} />
          ),
        onClick: (row: Record<string, unknown>) => {
          const request = row as unknown as ProviderRequest;
          if (request.status === "PENDING") {
            onApproveRequest(request.id);
          }
        },
        variant: "default",
        disabled: (row: Record<string, unknown>) => {
          const request = row as unknown as ProviderRequest;
          return request.status !== "PENDING" || isUpdating;
        },
      },
      {
        id: "reject",
        label: "Rejeitar",
        icon: ({ className }) =>
          isUpdating ? (
            <Loader2 className={`${className} animate-spin`} />
          ) : (
            <X className={className} />
          ),
        onClick: (row: Record<string, unknown>) => {
          const request = row as unknown as ProviderRequest;
          if (request.status === "PENDING") {
            onRejectRequest(request.id);
          }
        },
        variant: "destructive",
        disabled: (row: Record<string, unknown>) => {
          const request = row as unknown as ProviderRequest;
          return request.status !== "PENDING" || isUpdating;
        },
      },
    ],
    [onApproveRequest, onRejectRequest, isUpdating]
  );

  // Conteúdo do modal de detalhes
  const detailModalContent = (request: ProviderRequest) => (
    <>
      <DetailModalSection
        title="ID da Solicitação"
        icon={<Hash className="h-3 w-3" />}
      >
        {request.id}
      </DetailModalSection>

      <DetailModalSection
        title="Solicitante"
        icon={<User className="h-3 w-3" />}
      >
        <div className="space-y-1">
          <p className="font-medium">{request.user.name}</p>
          <p className="text-sm text-muted-foreground">{request.user.email}</p>
        </div>
      </DetailModalSection>

      {request.services && request.services.length > 0 && (
        <DetailModalSection
          title="Serviços Oferecidos"
          icon={<Building className="h-3 w-3" />}
        >
          <div className="space-y-2">
            {request.services.map((service, index) => (
              <div key={index} className="p-2 border rounded bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {getServiceLabel(service.serviceType)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {service.experienceLevel}
                  </Badge>
                </div>
                {service.customService && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {service.customService}
                  </p>
                )}
              </div>
            ))}
          </div>
        </DetailModalSection>
      )}

      <DetailModalSection title="Telefone" icon={<Phone className="h-3 w-3" />}>
        {request.phone}
      </DetailModalSection>

      <DetailModalSection
        title="Endereço"
        icon={<MapPin className="h-3 w-3" />}
      >
        <div className="space-y-1">
          <p>{request.address}</p>
          {request.cep && (
            <p className="text-sm text-muted-foreground">CEP: {request.cep}</p>
          )}
        </div>
      </DetailModalSection>

      <DetailModalSection
        title="CPF/CNPJ"
        icon={<FileText className="h-3 w-3" />}
      >
        {request.documentNumber}
      </DetailModalSection>

      <DetailModalSection title="Status" icon={<Clock className="h-3 w-3" />}>
        {getStatusBadge(request.status)}
      </DetailModalSection>

      <DetailModalSection
        title="Data da Solicitação"
        icon={<Calendar className="h-3 w-3" />}
      >
        {new Date(request.createdAt).toLocaleString("pt-BR")}
      </DetailModalSection>

      {request.reviewedAt && (
        <DetailModalSection
          title="Data de Revisão"
          icon={<CheckCircle className="h-3 w-3" />}
        >
          {new Date(request.reviewedAt).toLocaleString("pt-BR")}
        </DetailModalSection>
      )}

      {request.reviewedByUser && (
        <DetailModalSection
          title="Revisado por"
          icon={<User className="h-3 w-3" />}
        >
          {request.reviewedByUser.name} ({request.reviewedByUser.email})
        </DetailModalSection>
      )}
    </>
  );

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedRequest(null);
  };

  return (
    <>
      <GenericTable
        data={requests as unknown as Record<string, unknown>[]}
        columns={columns}
        actions={customActions}
        searchPlaceholder="Buscar por nome, email ou serviços..."
        sortOptions={[
          { value: "user.name", label: "Solicitante" },
          { value: "status", label: "Status" },
          { value: "createdAt", label: "Data da Solicitação" },
          { value: "reviewedAt", label: "Data de Revisão" },
        ]}
        filterOptions={[
          { value: "todos", label: "Todos os status" },
          { value: "PENDING", label: "Pendentes" },
          { value: "APPROVED", label: "Aprovadas" },
          { value: "REJECTED", label: "Rejeitadas" },
        ]}
        onRowClick={(row) => {
          const request = row as unknown as ProviderRequest;
          setSelectedRequest(request);
          setIsDialogOpen(true);
        }}
        detailModalContent={(row) =>
          detailModalContent(row as unknown as ProviderRequest)
        }
      />

      {selectedRequest && (
        <RequestDetailsDialog
          request={selectedRequest}
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onUpdate={onRequestUpdate}
        />
      )}
    </>
  );
}
