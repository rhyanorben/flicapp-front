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

interface ServiceHistory {
  id: string;
  cliente: string;
  tipoServico: string;
  descricao: string;
  dataRealizacao: string;
  valor: number;
  status: "concluido" | "cancelado";
  avaliacao?: number;
  comentario?: string;
}

export function ServicesHistoryTable() {
  const [periodFilter, setPeriodFilter] = useState("todos");

  // Dados mockados - em produção viria da API
  const servicesHistory: ServiceHistory[] = useMemo(
    () => [
      {
        id: "SERV-001",
        cliente: "Ana Silva",
        tipoServico: "Limpeza",
        descricao: "Limpeza residencial completa",
        dataRealizacao: "2024-01-15",
        valor: 150.0,
        status: "concluido",
        avaliacao: 5,
        comentario: "Excelente trabalho, muito pontual e organizado!",
      },
      {
        id: "SERV-002",
        cliente: "João Santos",
        tipoServico: "Manutenção",
        descricao: "Reparo no ar condicionado",
        dataRealizacao: "2024-01-14",
        valor: 200.0,
        status: "concluido",
        avaliacao: 4,
        comentario: "Resolveu o problema rapidamente.",
      },
      {
        id: "SERV-003",
        cliente: "Maria Costa",
        tipoServico: "Instalação",
        descricao: "Instalação de ventilador",
        dataRealizacao: "2024-01-12",
        valor: 120.0,
        status: "concluido",
        avaliacao: 5,
        comentario: "Instalação perfeita, muito profissional!",
      },
      {
        id: "SERV-004",
        cliente: "Pedro Oliveira",
        tipoServico: "Consultoria",
        descricao: "Consultoria em organização",
        dataRealizacao: "2024-01-10",
        valor: 80.0,
        status: "concluido",
        avaliacao: 4,
        comentario: "Ótimas dicas para organização.",
      },
      {
        id: "SERV-005",
        cliente: "Carla Mendes",
        tipoServico: "Reparo",
        descricao: "Reparo de eletrodoméstico",
        dataRealizacao: "2024-01-08",
        valor: 90.0,
        status: "concluido",
        avaliacao: 3,
        comentario: "Serviço realizado conforme esperado.",
      },
      {
        id: "SERV-006",
        cliente: "Roberto Lima",
        tipoServico: "Limpeza",
        descricao: "Limpeza pós-obra",
        dataRealizacao: "2024-01-05",
        valor: 300.0,
        status: "cancelado",
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
      render: (value) => getStatusBadge(value as ServiceHistory["status"]),
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
        Boolean(service.status === "concluido" && service.avaliacao),
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

  const getStatusBadge = (status: ServiceHistory["status"]) => {
    const statusConfig = {
      concluido: { label: "Concluído", variant: "default" as const },
      cancelado: { label: "Cancelado", variant: "destructive" as const },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPeriodFilter = (date: string) => {
    const serviceDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - serviceDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return "7dias";
    if (diffDays <= 30) return "30dias";
    if (diffDays <= 90) return "90dias";
    return "mais90dias";
  };

  // Filter data by period
  const filteredData = useMemo(() => {
    if (periodFilter === "todos") return servicesHistory;
    return servicesHistory.filter(
      (service) => getPeriodFilter(service.dataRealizacao) === periodFilter
    );
  }, [servicesHistory, periodFilter]);

  const handleViewRating = (serviceId: string) => {
    console.log("Ver avaliação do serviço:", serviceId);
  };

  // Detail modal content
  const detailModalContent = (service: ServiceHistory) => (
    <>
      <DetailModalSection title="ID" icon={<span className="text-xs">#</span>}>
        {service.id}
      </DetailModalSection>

      <DetailModalSection title="Cliente" icon={<User className="h-3 w-3" />}>
        {service.cliente}
      </DetailModalSection>

      <DetailModalSection
        title="Tipo de Serviço"
        icon={<Wrench className="h-3 w-3" />}
      >
        {service.tipoServico}
      </DetailModalSection>

      <DetailModalSection
        title="Descrição"
        icon={<FileText className="h-3 w-3" />}
      >
        {service.descricao}
      </DetailModalSection>

      <DetailModalSection
        title="Data Realização"
        icon={<Calendar className="h-3 w-3" />}
      >
        {formatDate(service.dataRealizacao)}
      </DetailModalSection>

      <DetailModalSection
        title="Valor"
        icon={<DollarSign className="h-3 w-3" />}
      >
        {formatCurrency(service.valor)}
      </DetailModalSection>

      <DetailModalSection
        title="Status"
        icon={<BarChart3 className="h-3 w-3" />}
      >
        {getStatusBadge(service.status)}
      </DetailModalSection>

      {service.avaliacao && (
        <DetailModalSection
          title="Avaliação"
          icon={<Star className="h-3 w-3" />}
        >
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{service.avaliacao}</span>
          </div>
        </DetailModalSection>
      )}

      {service.comentario && (
        <DetailModalSection
          title="Comentário"
          icon={<MessageCircle className="h-3 w-3" />}
        >
          {service.comentario}
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
          detailModalContent(row as unknown as ServiceHistory)
        }
      />
    </div>
  );
}
