"use client";

import { useMemo } from "react";
import {
  Star,
  Calendar,
  User,
  DollarSign,
  Wrench,
  FileText,
  BarChart3,
  MapPin,
} from "lucide-react";
import {
  GenericTable,
  TableColumn,
  TableAction,
} from "@/components/ui/generic-table";
import { DetailModalSection } from "@/components/ui/detail-modal";
import { useOrders } from "@/hooks/use-orders";

interface Order {
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

// Map database status to display status
const mapStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    matching: "Aguardando",
    await_cpf: "Aguardando",
    await_provider: "Aguardando",
    accepted: "Em Andamento",
    in_progress: "Em Andamento",
    completed: "Concluído",
    cancelled: "Cancelado",
  };
  return statusMap[status] || status;
};

// Map database status to filter value
const mapStatusToFilter = (status: string): string => {
  const statusMap: Record<string, string> = {
    matching: "aguardando",
    await_cpf: "aguardando",
    await_provider: "aguardando",
    accepted: "em-andamento",
    in_progress: "em-andamento",
    completed: "concluido",
    cancelled: "cancelado",
  };
  return statusMap[status] || "aguardando";
};

export function OrdersTable() {
  const { data: orders, isLoading, error } = useOrders();

  // Transform orders for display
  const transformedOrders = useMemo(() => {
    if (!orders) return [];

    return orders.map((order) => ({
      id: order.id,
      tipoServico: order.category?.name || "Não especificado",
      descricao: order.description,
      status: mapStatus(order.status),
      statusFilter: mapStatusToFilter(order.status),
      data: new Date(order.createdAt).toLocaleDateString("pt-BR"),
      prestador: order.provider?.name || "Não atribuído",
      avaliacao: order.orderReview?.rating || null,
      valor: order.finalPriceCents ? order.finalPriceCents / 100 : null,
      localizacao: order.address
        ? `${order.address.street}, ${order.address.number}, ${order.address.neighborhood}, ${order.address.city} - ${order.address.state}`
        : "Não informado",
      // Keep original order for actions
      originalOrder: order,
    }));
  }, [orders]);

  // Configuração das colunas
  const columns: TableColumn[] = [
    { key: "id", label: "ID", width: "120px", sortable: true },
    { key: "tipoServico", label: "Tipo de Serviço", sortable: true },
    { key: "descricao", label: "Descrição" },
    { key: "status", label: "Status", sortable: true },
    { key: "data", label: "Data", sortable: true },
    { key: "prestador", label: "Prestador", sortable: true },
    { key: "valor", label: "Valor", sortable: true },
    { key: "avaliacao", label: "Avaliação" },
  ];

  // Ações customizadas específicas para pedidos (opcional)
  const customActions: TableAction[] = [
    {
      id: "cancel",
      label: "Cancelar Pedido",
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
      onClick: (order) => console.log("Cancelar pedido:", order.id),
      variant: "destructive",
      show: (order) => order.statusFilter === "aguardando",
    },
    {
      id: "rate",
      label: "Avaliar Serviço",
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
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      onClick: (order) => console.log("Avaliar pedido:", order.id),
      variant: "success",
      show: (order) =>
        order.statusFilter === "concluido" &&
        !(order.avaliacao || (order as any).orderReview?.rating),
    },
  ];

  // Conteúdo do modal de detalhes
  const detailModalContent = (order: any) => (
    <>
      <DetailModalSection title="ID do Pedido">{order.id}</DetailModalSection>
      <DetailModalSection
        title="Tipo de Serviço"
        icon={<Wrench className="h-3 w-3" />}
      >
        {order.tipoServico}
      </DetailModalSection>
      <DetailModalSection
        title="Descrição"
        icon={<FileText className="h-3 w-3" />}
      >
        {order.descricao}
      </DetailModalSection>
      <DetailModalSection
        title="Status"
        icon={<BarChart3 className="h-3 w-3" />}
      >
        {order.status}
      </DetailModalSection>
      <DetailModalSection title="Data" icon={<Calendar className="h-3 w-3" />}>
        {order.data}
      </DetailModalSection>
      <DetailModalSection title="Prestador" icon={<User className="h-3 w-3" />}>
        {order.prestador}
      </DetailModalSection>
      {order.valor && (
        <DetailModalSection
          title="Valor"
          icon={<DollarSign className="h-3 w-3" />}
        >
          {order.valor}
        </DetailModalSection>
      )}
      {order.localizacao && (
        <DetailModalSection
          title="Localização"
          icon={<MapPin className="h-3 w-3" />}
        >
          {order.localizacao}
        </DetailModalSection>
      )}
      {order.avaliacao && (
        <DetailModalSection
          title="Avaliação"
          icon={<Star className="h-3 w-3" />}
        >
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{order.avaliacao}/5</span>
          </div>
        </DetailModalSection>
      )}
    </>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded animate-pulse w-48" />
        <div className="space-y-2">
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
        Erro ao carregar pedidos. Tente novamente.
      </div>
    );
  }

  return (
    <GenericTable
      title="Pedidos Recentes"
      icon={<Calendar className="h-5 w-5" />}
      data={transformedOrders as unknown as Record<string, unknown>[]}
      columns={columns}
      actions={customActions}
      searchPlaceholder="Buscar por ID, descrição ou prestador..."
      sortOptions={[
        { value: "id", label: "ID" },
        { value: "tipoServico", label: "Tipo de Serviço" },
        { value: "data", label: "Data" },
        { value: "status", label: "Status" },
      ]}
      filterOptions={[
        { value: "todos", label: "Todos os status" },
        { value: "aguardando", label: "Aguardando" },
        { value: "em-andamento", label: "Em Andamento" },
        { value: "concluido", label: "Concluído" },
        { value: "cancelado", label: "Cancelado" },
      ]}
      detailModalContent={(row) =>
        detailModalContent((row as any).originalOrder || row)
      }
    />
  );
}
