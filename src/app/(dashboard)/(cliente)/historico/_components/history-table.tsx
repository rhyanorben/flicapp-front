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

interface HistoryOrder {
  id: string;
  tipoServico: string;
  descricao: string;
  status: "concluido" | "cancelado";
  data: string;
  prestador: string;
  avaliacao?: number;
  dataFinalizacao: string;
  valor?: number;
  localizacao?: string;
  comentario?: string;
}

export function HistoryTable() {
  const [periodFilter, setPeriodFilter] = useState("todos");

  // Dados mockados - em produção viria da API
  const historyOrders: HistoryOrder[] = useMemo(
    () => [
      {
        id: "PED-001",
        tipoServico: "Limpeza",
        descricao: "Limpeza residencial completa",
        status: "concluido",
        data: "2024-01-15",
        prestador: "João Silva",
        avaliacao: 5,
        dataFinalizacao: "2024-01-16",
        valor: 150.0,
        localizacao: "São Paulo, SP",
        comentario: "Excelente trabalho, muito pontual e organizado!",
      },
      {
        id: "PED-002",
        tipoServico: "Manutenção",
        descricao: "Reparo no ar condicionado",
        status: "concluido",
        data: "2024-01-10",
        prestador: "Maria Santos",
        avaliacao: 4,
        dataFinalizacao: "2024-01-12",
        valor: 200.0,
        localizacao: "São Paulo, SP",
        comentario: "Resolveu o problema rapidamente.",
      },
      {
        id: "PED-003",
        tipoServico: "Instalação",
        descricao: "Instalação de ventilador",
        status: "concluido",
        data: "2024-01-05",
        prestador: "Pedro Costa",
        dataFinalizacao: "2024-01-07",
        valor: 120.0,
        localizacao: "São Paulo, SP",
      },
      {
        id: "PED-004",
        tipoServico: "Consultoria",
        descricao: "Consultoria em organização",
        status: "cancelado",
        data: "2024-01-02",
        prestador: "Ana Oliveira",
        dataFinalizacao: "2024-01-03",
        valor: 80.0,
        localizacao: "São Paulo, SP",
      },
      {
        id: "PED-005",
        tipoServico: "Reparo",
        descricao: "Reparo de eletrodoméstico",
        status: "concluido",
        data: "2023-12-28",
        prestador: "Carlos Mendes",
        avaliacao: 3,
        dataFinalizacao: "2023-12-30",
        valor: 90.0,
        localizacao: "São Paulo, SP",
        comentario: "Serviço realizado conforme esperado.",
      },
    ],
    []
  );

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
      render: (value) => getStatusBadge(value as HistoryOrder["status"]),
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
        Boolean(order.status === "concluido" && !order.avaliacao),
    },
    {
      id: "view-rating",
      label: "Ver Avaliação",
      icon: ({ className }) => <Star className={className} />,
      onClick: (order) => handleViewRating(order.id as string),
      show: (order) => Boolean(order.status === "concluido" && order.avaliacao),
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

  const getStatusBadge = (status: HistoryOrder["status"]) => {
    const statusConfig = {
      concluido: { label: "Concluído", variant: "default" as const },
      cancelado: { label: "Cancelado", variant: "destructive" as const },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPeriodFilter = (date: string) => {
    const orderDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - orderDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return "7dias";
    if (diffDays <= 30) return "30dias";
    if (diffDays <= 90) return "90dias";
    return "mais90dias";
  };

  // Filter data by period
  const filteredData = useMemo(() => {
    if (periodFilter === "todos") return historyOrders;
    return historyOrders.filter(
      (order) => getPeriodFilter(order.data) === periodFilter
    );
  }, [historyOrders, periodFilter]);

  const handleRateOrder = (orderId: string) => {
    console.log("Avaliar pedido:", orderId);
    // Implementar modal de avaliação
  };

  const handleViewRating = (orderId: string) => {
    console.log("Ver avaliação do pedido:", orderId);
    // Implementar modal para visualizar avaliação
  };

  // Detail modal content
  const detailModalContent = (order: HistoryOrder) => (
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
        {getStatusBadge(order.status)}
      </DetailModalSection>

      <DetailModalSection
        title="Data do Pedido"
        icon={<Calendar className="h-3 w-3" />}
      >
        {formatDate(order.data)}
      </DetailModalSection>

      <DetailModalSection
        title="Data de Finalização"
        icon={<Calendar className="h-3 w-3" />}
      >
        {formatDate(order.dataFinalizacao)}
      </DetailModalSection>

      <DetailModalSection title="Prestador" icon={<User className="h-3 w-3" />}>
        {order.prestador}
      </DetailModalSection>

      {order.valor && (
        <DetailModalSection
          title="Valor"
          icon={<DollarSign className="h-3 w-3" />}
        >
          {formatCurrency(order.valor)}
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

      {order.comentario && (
        <DetailModalSection
          title="Comentário"
          icon={<MessageCircle className="h-3 w-3" />}
        >
          {order.comentario}
        </DetailModalSection>
      )}
    </>
  );

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
          detailModalContent(row as unknown as HistoryOrder)
        }
      />
    </div>
  );
}
