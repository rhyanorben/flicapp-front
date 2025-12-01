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
import { useProviderRequests } from "@/hooks/use-provider-requests";
import { authClient } from "@/lib/auth-client";

// Map OrderInvitation status to display status
const mapInvitationStatus = (request: {
  respondedAt: string | null;
  response: string | null;
  status: string | null;
  expiresAt: string | null;
  orderStatus: string;
}): string => {
  const now = new Date();
  const hasExpired =
    request.expiresAt && new Date(request.expiresAt) < now;
  const isResponded = request.respondedAt !== null;

  // Expirada: expiresAt < agora E respondedAt é null
  if (hasExpired && !isResponded) {
    return "expirada";
  }

  // Aceita: response === "accepted" OU status indica aceito OU order.status é "accepted"/"in_progress"/"completed"
  if (
    request.response === "accepted" ||
    request.status === "accepted" ||
    ["accepted", "in_progress", "completed"].includes(request.orderStatus)
  ) {
    return "aceita";
  }

  // Recusada: response === "rejected" OU status indica rejeitado OU order.status é "cancelled"
  if (
    request.response === "rejected" ||
    request.status === "rejected" ||
    request.orderStatus === "cancelled"
  ) {
    return "recusada";
  }

  // Pendente: respondedAt é null E (expiresAt é null OU expiresAt > agora)
  if (!isResponded && (!request.expiresAt || !hasExpired)) {
    return "pendente";
  }

  // Default to pendente
  return "pendente";
};

export function RequestsTable() {
  const { data: providerRequests, isLoading, error } = useProviderRequests();
  const { data: session } = authClient.useSession();
  // const currentUserId = session?.user?.id;

  // Transform requests for display
  const transformedRequests = useMemo(() => {
    if (!providerRequests) return [];

    return providerRequests.map((request, index) => {
      const displayStatus = mapInvitationStatus({
        respondedAt: request.respondedAt,
        response: request.response,
        status: request.status,
        expiresAt: request.expiresAt,
        orderStatus: request.orderStatus,
      });

      return {
        id: request.invitationId || request.id || `request-${index}-${Date.now()}`,
        cliente: request.client?.name || "Não informado",
        tipoServico: request.category?.name || "Não especificado",
        descricao: request.description,
        status: displayStatus,
        statusFilter: displayStatus,
        dataSolicitacao: formatDate(request.sentAt || request.createdAt),
        dataPreferencial: formatDate(request.slotStart) || "Não agendado",
        localizacao: request.address
          ? `${request.address.street}, ${request.address.number}, ${request.address.neighborhood}, ${request.address.city} - ${request.address.state}`
          : "Não informado",
        valor: request.finalPriceCents
          ? request.finalPriceCents / 100
          : request.depositCents / 100,
        prazoResposta: request.expiresAt
          ? formatDate(request.expiresAt)
          : request.sentAt
          ? formatDate(
              new Date(
                new Date(request.sentAt).getTime() + 24 * 60 * 60 * 1000
              )
            )
          : "Não informado",
        // Keep original request for actions
        originalRequest: request,
      };
    });
  }, [providerRequests]);

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
      render: (value) =>
        getStatusBadge(
          value as "pendente" | "aceita" | "recusada" | "expirada"
        ),
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
      show: (request) => Boolean(request.statusFilter === "pendente"),
    },
    {
      id: "reject",
      label: "Rejeitar Solicitação",
      icon: ({ className }) => <XCircle className={className} />,
      onClick: (request) => handleRejectRequest(request.id as string),
      variant: "destructive",
      show: (request) => Boolean(request.statusFilter === "pendente"),
    },
    {
      id: "contact",
      label: "Contatar Cliente",
      icon: ({ className }) => <MessageCircle className={className} />,
      onClick: (request) => handleContactClient(request.id as string),
      show: (request) => Boolean(request.statusFilter === "aceita"),
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

  const getStatusBadge = (
    status: "pendente" | "aceita" | "recusada" | "expirada"
  ) => {
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
  const detailModalContent = (request: Record<string, unknown>) => (
    <>
      <DetailModalSection title="ID" icon={<span className="text-xs">#</span>}>
        {String(request.id)}
      </DetailModalSection>

      <DetailModalSection title="Cliente" icon={<User className="h-3 w-3" />}>
        {String(request.cliente)}
      </DetailModalSection>

      <DetailModalSection
        title="Tipo de Serviço"
        icon={<Wrench className="h-3 w-3" />}
      >
        {String(request.tipoServico)}
      </DetailModalSection>

      <DetailModalSection
        title="Descrição"
        icon={<FileText className="h-3 w-3" />}
      >
        {String(request.descricao)}
      </DetailModalSection>

      <DetailModalSection
        title="Data Solicitação"
        icon={<Calendar className="h-3 w-3" />}
      >
        {formatDate(String(request.dataSolicitacao))}
      </DetailModalSection>

      <DetailModalSection
        title="Data Preferencial"
        icon={<Calendar className="h-3 w-3" />}
      >
        {formatDate(String(request.dataPreferencial))}
      </DetailModalSection>

      <DetailModalSection
        title="Localização"
        icon={<MapPin className="h-3 w-3" />}
      >
        {String(request.localizacao)}
      </DetailModalSection>

      <DetailModalSection
        title="Valor"
        icon={<DollarSign className="h-3 w-3" />}
      >
        {formatCurrency(Number(request.valor))}
      </DetailModalSection>

      <DetailModalSection
        title="Status"
        icon={<BarChart3 className="h-3 w-3" />}
      >
        {getStatusBadge(
          request.status as "pendente" | "aceita" | "recusada" | "expirada"
        )}
      </DetailModalSection>

      <DetailModalSection
        title="Prazo Resposta"
        icon={<Calendar className="h-3 w-3" />}
      >
        {formatDate(String(request.prazoResposta))}
      </DetailModalSection>
    </>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded animate-pulse w-48" />
        <div className="border rounded-md">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center p-4 border-b last:border-b-0 animate-pulse"
            >
              <div className="h-4 bg-muted rounded w-1/4 mr-4" />
              <div className="h-4 bg-muted rounded w-1/3 mr-4" />
              <div className="h-4 bg-muted rounded w-1/6 mr-4" />
              <div className="h-4 bg-muted rounded w-1/6" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Erro ao carregar solicitações. Tente novamente.
      </div>
    );
  }

  return (
    <GenericTable
      title="Todas as Solicitações"
      icon={<MessageSquare className="h-5 w-5" />}
      data={transformedRequests as unknown as Record<string, unknown>[]}
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
      detailModalContent={(row) => detailModalContent(row)}
    />
  );
}
