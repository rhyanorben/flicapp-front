"use client";

import { useMemo } from "react";
import {
  MessageSquare,
  User,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle,
  XCircle,
  MessageCircle,
  Wrench,
  FileText,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  GenericTable,
  TableColumn,
  TableAction,
} from "@/components/ui/generic-table";
import { DetailModalSection } from "@/components/ui/detail-modal";
import { formatCurrency, formatDate } from "@/lib/utils/table-utils";

interface Request {
  id: string;
  cliente: string;
  tipoServico: string;
  descricao: string;
  dataSolicitacao: string;
  dataPreferencial: string;
  localizacao: string;
  valor: number;
  status: "pendente" | "aceita" | "recusada" | "expirada";
  prazoResposta: string;
}

export function RequestsTable() {
  // Dados mockados - em produção viria da API
  const requests: Request[] = useMemo(
    () => [
      {
        id: "REQ-001",
        cliente: "Ana Silva",
        tipoServico: "Limpeza",
        descricao: "Limpeza residencial completa",
        dataSolicitacao: "2024-01-15",
        dataPreferencial: "2024-01-20",
        localizacao: "São Paulo, SP",
        valor: 150.0,
        status: "pendente",
        prazoResposta: "2024-01-16",
      },
      {
        id: "REQ-002",
        cliente: "João Santos",
        tipoServico: "Manutenção",
        descricao: "Reparo no ar condicionado",
        dataSolicitacao: "2024-01-14",
        dataPreferencial: "2024-01-18",
        localizacao: "São Paulo, SP",
        valor: 200.0,
        status: "pendente",
        prazoResposta: "2024-01-15",
      },
      {
        id: "REQ-003",
        cliente: "Maria Costa",
        tipoServico: "Instalação",
        descricao: "Instalação de ventilador",
        dataSolicitacao: "2024-01-13",
        dataPreferencial: "2024-01-17",
        localizacao: "São Paulo, SP",
        valor: 120.0,
        status: "aceita",
        prazoResposta: "2024-01-14",
      },
      {
        id: "REQ-004",
        cliente: "Pedro Oliveira",
        tipoServico: "Consultoria",
        descricao: "Consultoria em organização",
        dataSolicitacao: "2024-01-12",
        dataPreferencial: "2024-01-16",
        localizacao: "São Paulo, SP",
        valor: 80.0,
        status: "aceita",
        prazoResposta: "2024-01-13",
      },
      {
        id: "REQ-005",
        cliente: "Carla Mendes",
        tipoServico: "Reparo",
        descricao: "Reparo de eletrodoméstico",
        dataSolicitacao: "2024-01-11",
        dataPreferencial: "2024-01-15",
        localizacao: "São Paulo, SP",
        valor: 90.0,
        status: "recusada",
        prazoResposta: "2024-01-12",
      },
      {
        id: "REQ-006",
        cliente: "Roberto Lima",
        tipoServico: "Limpeza",
        descricao: "Limpeza pós-obra",
        dataSolicitacao: "2024-01-10",
        dataPreferencial: "2024-01-14",
        localizacao: "São Paulo, SP",
        valor: 300.0,
        status: "expirada",
        prazoResposta: "2024-01-11",
      },
    ],
    []
  );

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
      key: "dataSolicitacao",
      label: "Data Solicitação",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{formatDate(value as string)}</span>
        </div>
      ),
    },
    {
      key: "dataPreferencial",
      label: "Data Preferencial",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{formatDate(value as string)}</span>
        </div>
      ),
    },
    {
      key: "localizacao",
      label: "Localização",
      render: (value) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{String(value)}</span>
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
      render: (value) => getStatusBadge(value as Request["status"]),
    },
  ];

  // Custom actions
  const customActions: TableAction[] = [
    {
      id: "accept",
      label: "Aceitar Solicitação",
      icon: ({ className }) => <CheckCircle className={className} />,
      onClick: (request) => handleAcceptRequest(request.id as string),
      variant: "success",
      show: (request) => Boolean(request.status === "pendente"),
    },
    {
      id: "reject",
      label: "Rejeitar Solicitação",
      icon: ({ className }) => <XCircle className={className} />,
      onClick: (request) => handleRejectRequest(request.id as string),
      variant: "destructive",
      show: (request) => Boolean(request.status === "pendente"),
    },
    {
      id: "contact",
      label: "Contatar Cliente",
      icon: ({ className }) => <MessageCircle className={className} />,
      onClick: (request) => handleContactClient(request.id as string),
      show: (request) => Boolean(request.status === "aceita"),
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
      onClick: (request) => {
        console.log("Exportar solicitação:", request.id);
        // Implementar exportação individual
      },
    },
  ];

  const getStatusBadge = (status: Request["status"]) => {
    const statusConfig = {
      pendente: { label: "Pendente", variant: "secondary" as const },
      aceita: { label: "Aceita", variant: "default" as const },
      recusada: { label: "Recusada", variant: "destructive" as const },
      expirada: { label: "Expirada", variant: "outline" as const },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleAcceptRequest = (requestId: string) => {
    console.log("Aceitar solicitação:", requestId);
    // Implementar lógica de aceitação
  };

  const handleRejectRequest = (requestId: string) => {
    console.log("Recusar solicitação:", requestId);
    // Implementar lógica de recusa
  };

  const handleContactClient = (requestId: string) => {
    console.log("Contatar cliente:", requestId);
    // Implementar modal de contato
  };

  // Detail modal content
  const detailModalContent = (request: Request) => (
    <>
      <DetailModalSection title="ID" icon={<span className="text-xs">#</span>}>
        {request.id}
      </DetailModalSection>

      <DetailModalSection title="Cliente" icon={<User className="h-3 w-3" />}>
        {request.cliente}
      </DetailModalSection>

      <DetailModalSection
        title="Tipo de Serviço"
        icon={<Wrench className="h-3 w-3" />}
      >
        {request.tipoServico}
      </DetailModalSection>

      <DetailModalSection
        title="Descrição"
        icon={<FileText className="h-3 w-3" />}
      >
        {request.descricao}
      </DetailModalSection>

      <DetailModalSection
        title="Data Solicitação"
        icon={<Calendar className="h-3 w-3" />}
      >
        {formatDate(request.dataSolicitacao)}
      </DetailModalSection>

      <DetailModalSection
        title="Data Preferencial"
        icon={<Calendar className="h-3 w-3" />}
      >
        {formatDate(request.dataPreferencial)}
      </DetailModalSection>

      <DetailModalSection
        title="Localização"
        icon={<MapPin className="h-3 w-3" />}
      >
        {request.localizacao}
      </DetailModalSection>

      <DetailModalSection
        title="Valor"
        icon={<DollarSign className="h-3 w-3" />}
      >
        {formatCurrency(request.valor)}
      </DetailModalSection>

      <DetailModalSection
        title="Status"
        icon={<BarChart3 className="h-3 w-3" />}
      >
        {getStatusBadge(request.status)}
      </DetailModalSection>

      <DetailModalSection
        title="Prazo Resposta"
        icon={<Calendar className="h-3 w-3" />}
      >
        {formatDate(request.prazoResposta)}
      </DetailModalSection>
    </>
  );

  return (
    <GenericTable
      title="Todas as Solicitações"
      icon={<MessageSquare className="h-5 w-5" />}
      data={requests as unknown as Record<string, unknown>[]}
      columns={columns}
      actions={customActions}
      searchPlaceholder="Buscar por ID, cliente, descrição ou tipo de serviço..."
      sortOptions={[
        { value: "id", label: "ID" },
        { value: "cliente", label: "Cliente" },
        { value: "tipoServico", label: "Tipo de Serviço" },
        { value: "dataSolicitacao", label: "Data Solicitação" },
        { value: "valor", label: "Valor" },
        { value: "status", label: "Status" },
      ]}
      filterOptions={[
        { value: "todos", label: "Todos os status" },
        { value: "pendente", label: "Pendente" },
        { value: "aceita", label: "Aceita" },
        { value: "recusada", label: "Recusada" },
        { value: "expirada", label: "Expirada" },
      ]}
      detailModalContent={(row) =>
        detailModalContent(row as unknown as Request)
      }
    />
  );
}
