"use client";

import { useMemo, useState } from "react";
import {
  Star,
  Briefcase,
  User,
  Calendar,
  DollarSign,
  Wrench,
  FileText,
  BarChart3,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  GenericTable,
  TableColumn,
  TableAction,
} from "@/components/ui/generic-table";
import { DetailModalSection } from "@/components/ui/detail-modal";
import { formatCurrency, formatDate } from "@/lib/utils/table-utils";
import { useProviderServices } from "@/hooks/use-provider-services";

// Types for service data
interface ServiceClient {
  name: string;
}

interface ServiceCategory {
  name: string;
}

interface ServiceOrderReview {
  rating: number;
  comment: string;
}

interface ServiceAddress {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface OriginalService {
  client?: ServiceClient;
  category?: ServiceCategory;
  orderReview?: ServiceOrderReview;
  address?: ServiceAddress;
  description?: string;
  slotStart?: string | Date;
  updatedAt?: string | Date;
  finalPriceCents?: number;
}

interface TransformedService {
  id: string;
  cliente: string;
  tipoServico: string;
  descricao: string;
  status: string;
  statusFilter: string;
  dataRealizacao: string;
  valor: number;
  avaliacao: number | null;
  comentario: string | null;
  originalService?: OriginalService;
}

// Map database status to display status
const mapStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    completed: "Concluído",
    cancelled: "Cancelado",
  };
  return statusMap[status] || status;
};

// Map database status to filter value
const mapStatusToFilter = (status: string): string => {
  const statusMap: Record<string, string> = {
    completed: "concluido",
    cancelled: "cancelado",
  };
  return statusMap[status] || "concluido";
};

export function ServicesHistoryTable() {
  const [periodFilter, setPeriodFilter] = useState("todos");
  const {
    data: providerServices,
    isLoading,
    error,
  } = useProviderServices(periodFilter);

  // Transform services for display
  const transformedServices = useMemo(() => {
    if (!providerServices) return [];

    return providerServices.map((service, index) => ({
      id: service.id || `service-${index}-${Date.now()}`, // Generate unique ID if missing
      cliente: service.client?.name || "Não informado",
      tipoServico: service.category?.name || "Não especificado",
      descricao: service.description,
      status: mapStatus(service.status),
      statusFilter: mapStatusToFilter(service.status),
      dataRealizacao: formatDate(service.slotStart || service.updatedAt),
      valor: service.finalPriceCents ? service.finalPriceCents / 100 : 0,
      avaliacao: service.orderReview?.rating || null,
      comentario: service.orderReview?.comment || null,
      // Keep original service for actions
      originalService: service,
    }));
  }, [providerServices]);

  // Period filter options
  const periodOptions = [
    { value: "todos", label: "Todos os períodos" },
    { value: "7dias", label: "Últimos 7 dias" },
    { value: "30dias", label: "Últimos 30 dias" },
    { value: "90dias", label: "Últimos 90 dias" },
    { value: "mais90dias", label: "Mais de 90 dias" },
  ];

  // Column definitions
  const columns: TableColumn[] = [
    { key: "id", label: "ID", width: "120px", sortable: true },
    {
      key: "cliente",
      label: "Cliente",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span>{String(value)}</span>
        </div>
      ),
    },
    { key: "tipoServico", label: "Tipo de Serviço", sortable: true },
    { key: "descricao", label: "Descrição" },
    {
      key: "dataRealizacao",
      label: "Data Realização",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{formatDate(value as string)}</span>
        </div>
      ),
    },
    {
      key: "valor",
      label: "Valor",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span>{formatCurrency(Number(value))}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => getStatusBadge(value as string),
    },
    {
      key: "avaliacao",
      label: "Avaliação",
      render: (value) =>
        value ? (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{String(value)}/5</span>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
  ];

  // Custom actions
  const customActions: TableAction[] = [
    {
      id: "view-rating",
      label: "Ver Avaliação",
      icon: ({ className }) => <Star className={className} />,
      onClick: (service) => handleViewRating(service.id as string),
      show: (service) =>
        Boolean(service.statusFilter === "concluido" && service.avaliacao),
    },
    {
      id: "export-selected",
      label: "Exportar Selecionados",
      icon: ({ className }) => (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      onClick: (service) => {
        console.log("Exportar serviço:", service.id);
        // Implementar exportação individual
      },
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      concluido: { label: "Concluído", variant: "default" as const },
      cancelado: { label: "Cancelado", variant: "destructive" as const },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.concluido;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Filter data by period (now handled by API)
  const filteredData = transformedServices;

  const handleViewRating = (serviceId: string) => {
    console.log("Ver avaliação do serviço:", serviceId);
  };

  // Detail modal content
  const detailModalContent = (service: TransformedService) => (
    <>
      <DetailModalSection title="ID" icon={<span className="text-xs">#</span>}>
        {service.id}
      </DetailModalSection>

      <DetailModalSection title="Cliente" icon={<User className="h-3 w-3" />}>
        {service.cliente ||
          service.originalService?.client?.name ||
          "Não informado"}
      </DetailModalSection>

      <DetailModalSection
        title="Tipo de Serviço"
        icon={<Wrench className="h-3 w-3" />}
      >
        {service.tipoServico ||
          service.originalService?.category?.name ||
          "Não especificado"}
      </DetailModalSection>

      <DetailModalSection
        title="Descrição"
        icon={<FileText className="h-3 w-3" />}
      >
        {service.descricao || service.originalService?.description}
      </DetailModalSection>

      <DetailModalSection
        title="Data Realização"
        icon={<Calendar className="h-3 w-3" />}
      >
        {service.dataRealizacao ||
          formatDate(
            service.originalService?.slotStart ||
              service.originalService?.updatedAt
          )}
      </DetailModalSection>

      <DetailModalSection
        title="Valor"
        icon={<DollarSign className="h-3 w-3" />}
      >
        {formatCurrency(
          service.valor ||
            (service.originalService?.finalPriceCents
              ? service.originalService.finalPriceCents / 100
              : 0)
        )}
      </DetailModalSection>

      <DetailModalSection
        title="Status"
        icon={<BarChart3 className="h-3 w-3" />}
      >
        {getStatusBadge(service.statusFilter as string)}
      </DetailModalSection>

      {(service.avaliacao || service.originalService?.orderReview?.rating) && (
        <DetailModalSection
          title="Avaliação"
          icon={<Star className="h-3 w-3" />}
        >
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">
              {service.avaliacao ||
                service.originalService?.orderReview?.rating}
            </span>
          </div>
        </DetailModalSection>
      )}

      {(service.comentario ||
        service.originalService?.orderReview?.comment) && (
        <DetailModalSection
          title="Comentário"
          icon={<MessageCircle className="h-3 w-3" />}
        >
          {service.comentario || service.originalService?.orderReview?.comment}
        </DetailModalSection>
      )}
    </>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Filtrar por período:</label>
          <div className="h-10 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded animate-pulse w-48" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Erro ao carregar histórico de serviços. Tente novamente.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Period Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Filtrar por período:</label>
        <select
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          {periodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Generic Table */}
      <GenericTable
        title="Histórico de Serviços"
        icon={<Briefcase className="h-5 w-5" />}
        data={filteredData as unknown as Record<string, unknown>[]}
        columns={columns}
        actions={customActions}
        searchPlaceholder="Buscar por ID, cliente, descrição ou tipo de serviço..."
        sortOptions={[
          { value: "id", label: "ID" },
          { value: "cliente", label: "Cliente" },
          { value: "tipoServico", label: "Tipo de Serviço" },
          { value: "dataRealizacao", label: "Data Realização" },
          { value: "valor", label: "Valor" },
          { value: "avaliacao", label: "Avaliação" },
          { value: "status", label: "Status" },
        ]}
        filterOptions={[
          { value: "todos", label: "Todos os status" },
          { value: "concluido", label: "Concluído" },
          { value: "cancelado", label: "Cancelado" },
        ]}
        detailModalContent={(row) =>
          detailModalContent(row as unknown as TransformedService)
        }
      />
    </div>
  );
}
