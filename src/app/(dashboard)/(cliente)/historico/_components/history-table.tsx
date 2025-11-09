"use client";

import { useMemo, useState } from "react";
import {
  Star,
  History,
  User,
  Calendar,
  DollarSign,
  Wrench,
  FileText,
  BarChart3,
  MapPin,
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
import { useHistoryOrders } from "@/hooks/use-history";

interface HistoryOrder {
  id: string;
  clientId: string;
  providerId: string | null;
  addressId: string | null;
  categoryId: string | null;
  description: string;
  status: string;
  depositMethod: string;
  depositBaseAvgCents: number | null;
  depositCents: number;
  slotStart: string | null;
  slotEnd: string | null;
  finalPriceCents: number | null;
  reviewStatus: string | null;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  provider?: {
    id: string;
    name: string;
    email: string | null;
  };
  address?: {
    id: string;
    street: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
    number: string | null;
  };
  orderReview?: {
    rating: number | null;
    comment: string | null;
  };
}

interface TransformedOrder {
  id: string;
  tipoServico: string;
  descricao: string;
  status: string;
  statusFilter: "concluido" | "cancelado";
  data: string;
  prestador: string;
  avaliacao: number | null;
  dataFinalizacao: string;
  valor: number | null;
  localizacao: string;
  comentario: string | null;
  originalOrder: HistoryOrder;
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

export function HistoryTable() {
  const [periodFilter, setPeriodFilter] = useState("todos");
  const {
    data: historyOrders,
    isLoading,
    error,
  } = useHistoryOrders(periodFilter);

  // Transform orders for display
  const transformedOrders = useMemo(() => {
    if (!historyOrders) return [];

    return historyOrders.map((order) => ({
      id: order.id,
      tipoServico: order.category?.name || "Não especificado",
      descricao: order.description,
      status: mapStatus(order.status),
      statusFilter: mapStatusToFilter(order.status),
      data: new Date(order.createdAt).toLocaleDateString("pt-BR"),
      prestador: order.provider?.name || "Não atribuído",
      avaliacao: order.orderReview?.rating || null,
      dataFinalizacao: new Date(order.updatedAt).toLocaleDateString("pt-BR"),
      valor: order.finalPriceCents ? order.finalPriceCents / 100 : null,
      localizacao: order.address
        ? `${order.address.street}, ${order.address.number}, ${order.address.neighborhood}, ${order.address.city} - ${order.address.state}`
        : "Não informado",
      comentario: order.orderReview?.comment || null,
      // Keep original order for actions
      originalOrder: order,
    }));
  }, [historyOrders]);

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
    { key: "tipoServico", label: "Tipo de Serviço", sortable: true },
    { key: "descricao", label: "Descrição" },
    {
      key: "status",
      label: "Status Final",
      sortable: true,
      render: (value, row) =>
        getStatusBadge((row as unknown as TransformedOrder).statusFilter),
    },
    {
      key: "data",
      label: "Data Pedido",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{formatDate(value as string)}</span>
        </div>
      ),
    },
    {
      key: "dataFinalizacao",
      label: "Data Finalização",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{formatDate(value as string)}</span>
        </div>
      ),
    },
    {
      key: "prestador",
      label: "Prestador",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span>{String(value)}</span>
        </div>
      ),
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
      id: "rate",
      label: "Avaliar Serviço",
      icon: ({ className }) => <Star className={className} />,
      onClick: (order) => handleRateOrder(order.id as string),
      variant: "success",
      show: (order) =>
        Boolean(order.statusFilter === "concluido" && !order.avaliacao),
    },
    {
      id: "view-rating",
      label: "Ver Avaliação",
      icon: ({ className }) => <Star className={className} />,
      onClick: (order) => handleViewRating(order.id as string),
      show: (order) =>
        Boolean(order.statusFilter === "concluido" && order.avaliacao),
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
      onClick: (order) => {
        console.log("Exportar pedido:", order.id);
        // Implementar exportação individual
      },
    },
  ];

  const getStatusBadge = (status: "concluido" | "cancelado") => {
    const statusConfig = {
      concluido: { label: "Concluído", variant: "default" as const },
      cancelado: { label: "Cancelado", variant: "destructive" as const },
    };

    const config = statusConfig[status] || {
      label: "Desconhecido",
      variant: "secondary" as const,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Filter data by period (now handled by API)
  const filteredData = transformedOrders;

  const handleRateOrder = (orderId: string) => {
    console.log("Avaliar pedido:", orderId);
    // Implementar modal de avaliação
  };

  const handleViewRating = (orderId: string) => {
    console.log("Ver avaliação do pedido:", orderId);
    // Implementar modal para visualizar avaliação
  };

  // Detail modal content
  const detailModalContent = (order: TransformedOrder) => (
    <>
      <DetailModalSection title="ID do Pedido">
        {String(order.id)}
      </DetailModalSection>

      <DetailModalSection
        title="Tipo de Serviço"
        icon={<Wrench className="h-3 w-3" />}
      >
        {order.tipoServico ||
          order.originalOrder?.category?.name ||
          "Não especificado"}
      </DetailModalSection>

      <DetailModalSection
        title="Descrição"
        icon={<FileText className="h-3 w-3" />}
      >
        {order.descricao || order.originalOrder?.description}
      </DetailModalSection>

      <DetailModalSection
        title="Status"
        icon={<BarChart3 className="h-3 w-3" />}
      >
        {getStatusBadge(order.statusFilter as "concluido" | "cancelado")}
      </DetailModalSection>

      <DetailModalSection
        title="Data do Pedido"
        icon={<Calendar className="h-3 w-3" />}
      >
        {order.data ||
          (order.originalOrder?.createdAt
            ? new Date(order.originalOrder.createdAt).toLocaleDateString(
                "pt-BR"
              )
            : "")}
      </DetailModalSection>

      <DetailModalSection
        title="Data de Finalização"
        icon={<Calendar className="h-3 w-3" />}
      >
        {order.dataFinalizacao ||
          (order.originalOrder?.updatedAt
            ? new Date(order.originalOrder.updatedAt).toLocaleDateString(
                "pt-BR"
              )
            : "")}
      </DetailModalSection>

      <DetailModalSection title="Prestador" icon={<User className="h-3 w-3" />}>
        {order.prestador ||
          order.originalOrder?.provider?.name ||
          "Não atribuído"}
      </DetailModalSection>

      {(order.valor || order.originalOrder?.finalPriceCents) && (
        <DetailModalSection
          title="Valor"
          icon={<DollarSign className="h-3 w-3" />}
        >
          {formatCurrency(
            order.valor ||
              (order.originalOrder?.finalPriceCents
                ? order.originalOrder.finalPriceCents / 100
                : 0)
          )}
        </DetailModalSection>
      )}

      {(order.localizacao || order.originalOrder?.address) && (
        <DetailModalSection
          title="Localização"
          icon={<MapPin className="h-3 w-3" />}
        >
          {order.localizacao ||
            (order.originalOrder?.address
              ? `${order.originalOrder.address.street}, ${order.originalOrder.address.number}, ${order.originalOrder.address.neighborhood}, ${order.originalOrder.address.city} - ${order.originalOrder.address.state}`
              : "Não informado")}
        </DetailModalSection>
      )}

      {(order.avaliacao || order.originalOrder?.orderReview?.rating) && (
        <DetailModalSection
          title="Avaliação"
          icon={<Star className="h-3 w-3" />}
        >
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>
              {order.avaliacao || order.originalOrder?.orderReview?.rating}/5
            </span>
          </div>
        </DetailModalSection>
      )}

      {(order.comentario || order.originalOrder?.orderReview?.comment) && (
        <DetailModalSection
          title="Comentário"
          icon={<MessageCircle className="h-3 w-3" />}
        >
          {order.comentario || order.originalOrder?.orderReview?.comment}
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
        Erro ao carregar histórico de pedidos. Tente novamente.
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
        title="Histórico de Pedidos"
        icon={<History className="h-5 w-5" />}
        data={filteredData as unknown as Record<string, unknown>[]}
        columns={columns}
        actions={customActions}
        searchPlaceholder="Buscar por ID, descrição ou prestador..."
        sortOptions={[
          { value: "id", label: "ID" },
          { value: "tipoServico", label: "Tipo de Serviço" },
          { value: "data", label: "Data Pedido" },
          { value: "dataFinalizacao", label: "Data Finalização" },
          { value: "status", label: "Status" },
          { value: "avaliacao", label: "Avaliação" },
        ]}
        filterOptions={[
          { value: "todos", label: "Todos os status" },
          { value: "concluido", label: "Concluído" },
          { value: "cancelado", label: "Cancelado" },
        ]}
        detailModalContent={(row) =>
          detailModalContent(row as unknown as TransformedOrder)
        }
      />
    </div>
  );
}
