"use client";

import { useMemo, useState } from "react";
import {
  Check,
  X,
  Calendar,
  User,
  Clock,
  MapPin,
  MessageSquare,
  Wrench,
  FileText,
  BarChart3,
  Phone,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  GenericTable,
  TableColumn,
  TableAction,
} from "@/components/ui/generic-table";
import { DetailModalSection } from "@/components/ui/detail-modal";
import { useAppointments } from "@/hooks/use-appointments";
import { formatCurrency, formatDate } from "@/lib/utils/table-utils";

interface TransformedAppointment {
  id: string;
  cliente: string;
  tipoServico: string;
  descricao: string;
  data: string;
  horario: string;
  localizacao: string;
  status: string;
  statusFilter:
    | "agendado"
    | "confirmado"
    | "em_andamento"
    | "concluido"
    | "cancelado";
  valor: number | null;
  avaliacao: number | null;
  observacoes?: string;
  originalAppointment: Record<string, unknown>;
}

// Map database status to display status
const mapStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    matching: "Agendado",
    await_cpf: "Aguardando CPF",
    await_provider: "Aguardando Prestador",
    accepted: "Confirmado",
    in_progress: "Em Andamento",
    completed: "Concluído",
    cancelled: "Cancelado",
  };
  return statusMap[status] || status;
};

// Map database status to filter value
const mapStatusToFilter = (
  status: string
): "agendado" | "confirmado" | "em_andamento" | "concluido" | "cancelado" => {
  const statusMap: Record<
    string,
    "agendado" | "confirmado" | "em_andamento" | "concluido" | "cancelado"
  > = {
    matching: "agendado",
    await_cpf: "agendado",
    await_provider: "agendado",
    accepted: "confirmado",
    in_progress: "em_andamento",
    completed: "concluido",
    cancelled: "cancelado",
  };
  return statusMap[status] || "agendado";
};

export function AppointmentsList() {
  const [periodFilter, setPeriodFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const {
    data: appointments,
    isLoading,
    error,
  } = useAppointments(periodFilter, statusFilter);

  // Transform appointments for display
  const transformedAppointments = useMemo(() => {
    if (!appointments) return [];

    return appointments.map((appointment, index) => ({
      id: appointment.id || `appointment-${index}-${Date.now()}`, // Generate unique ID if missing
      cliente: appointment.client?.name || "Não informado",
      tipoServico: appointment.category?.name || "Não especificado",
      descricao: appointment.description,
      data: formatDate(appointment.slotStart || appointment.createdAt),
      horario: appointment.slotStart
        ? new Date(appointment.slotStart).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Não agendado",
      localizacao: appointment.address
        ? `${appointment.address.street}, ${appointment.address.number}, ${appointment.address.neighborhood}, ${appointment.address.city} - ${appointment.address.state}`
        : "Não informado",
      status: mapStatus(appointment.status),
      statusFilter: mapStatusToFilter(appointment.status),
      valor: appointment.finalPriceCents
        ? appointment.finalPriceCents / 100
        : null,
      avaliacao: appointment.orderReview?.rating || null,
      observacoes: appointment.orderReview?.comment || undefined,
      // Keep original appointment for actions
      originalAppointment: appointment,
    }));
  }, [appointments]);

  // Period filter options
  const periodOptions = [
    { value: "todos", label: "Todos os períodos" },
    { value: "7dias", label: "Últimos 7 dias" },
    { value: "30dias", label: "Últimos 30 dias" },
    { value: "90dias", label: "Últimos 90 dias" },
    { value: "mais90dias", label: "Mais de 90 dias" },
  ];

  // Status filter options
  const statusOptions = [
    { value: "todos", label: "Todos os status" },
    { value: "agendado", label: "Agendado" },
    { value: "confirmado", label: "Confirmado" },
    { value: "em_andamento", label: "Em Andamento" },
    { value: "concluido", label: "Concluído" },
    { value: "cancelado", label: "Cancelado" },
  ];

  // Configuração das colunas
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
    {
      key: "descricao",
      label: "Descrição",
      width: "300px",
      render: (value) => (
        <span className="text-sm text-foreground truncate block max-w-[280px]">
          {String(value || "-")}
        </span>
      ),
    },
    {
      key: "data",
      label: "Data",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{formatDate(value as string)}</span>
        </div>
      ),
    },
    {
      key: "horario",
      label: "Horário",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span>{String(value)}</span>
        </div>
      ),
    },
    {
      key: "localizacao",
      label: "Localização",
      render: (value) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="truncate max-w-[200px]" title={String(value)}>
            {String(value)}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value, row) =>
        getStatusBadge((row as unknown as TransformedAppointment).statusFilter),
    },
    {
      key: "valor",
      label: "Valor",
      sortable: true,
      render: (value) =>
        value ? (
          <div className="flex items-center gap-2">
            <span className="font-medium">{formatCurrency(Number(value))}</span>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
  ];

  // Helper functions
  const getStatusBadge = (
    status:
      | "agendado"
      | "confirmado"
      | "em_andamento"
      | "concluido"
      | "cancelado"
  ) => {
    const statusConfig = {
      agendado: { label: "Agendado", variant: "secondary" as const },
      confirmado: { label: "Confirmado", variant: "default" as const },
      em_andamento: { label: "Em Andamento", variant: "default" as const },
      concluido: { label: "Concluído", variant: "default" as const },
      cancelado: { label: "Cancelado", variant: "destructive" as const },
    };

    const config = statusConfig[status] || {
      label: "Desconhecido",
      variant: "secondary" as const,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleConfirmAppointment = (appointmentId: string) => {
    console.log("Confirmar agendamento:", appointmentId);
    // Implementar confirmação de agendamento
  };

  const handleCancelAppointment = (appointmentId: string) => {
    console.log("Cancelar agendamento:", appointmentId);
    // Implementar cancelamento de agendamento
  };

  const handleContactClient = (appointment: TransformedAppointment) => {
    const client = (
      appointment.originalAppointment as {
        client?: { name?: string; email?: string; phoneE164?: string };
      }
    )?.client;
    console.log("Contatar cliente:", {
      id: appointment.id,
      name: client?.name,
      email: client?.email,
      phone: client?.phoneE164,
    });
    // Implementar contato com cliente
  };

  // Ações customizadas específicas para agendamentos
  const customActions: TableAction[] = [
    {
      id: "confirm",
      label: "Confirmar Agendamento",
      icon: ({ className }) => <Check className={className} />,
      onClick: (appointment) =>
        handleConfirmAppointment(appointment.id as string),
      variant: "success",
      show: (appointment) => appointment.statusFilter === "agendado",
    },
    {
      id: "cancel",
      label: "Cancelar Agendamento",
      icon: ({ className }) => <X className={className} />,
      onClick: (appointment) =>
        handleCancelAppointment(appointment.id as string),
      variant: "destructive",
      show: (appointment) =>
        appointment.statusFilter === "agendado" ||
        appointment.statusFilter === "confirmado",
    },
    {
      id: "contact",
      label: "Contatar Cliente",
      icon: ({ className }) => <MessageSquare className={className} />,
      onClick: (appointment) =>
        handleContactClient(appointment as unknown as TransformedAppointment),
      variant: "default",
      show: (appointment) =>
        appointment.statusFilter === "confirmado" ||
        appointment.statusFilter === "agendado" ||
        appointment.statusFilter === "em_andamento",
    },
  ];

  // Conteúdo do modal de detalhes
  const detailModalContent = (appointment: TransformedAppointment) => {
    const originalAppointment = appointment.originalAppointment as {
      client?: { name?: string; email?: string; phoneE164?: string };
    };
    const client = originalAppointment?.client;

    return (
      <>
        <DetailModalSection title="ID do Agendamento">
          {appointment.id}
        </DetailModalSection>

        <DetailModalSection title="Cliente" icon={<User className="h-3 w-3" />}>
          <div className="space-y-2">
            <div className="font-medium">{appointment.cliente}</div>
            {client?.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span>{client.email}</span>
              </div>
            )}
            {client?.phoneE164 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>{client.phoneE164}</span>
              </div>
            )}
          </div>
        </DetailModalSection>

        <DetailModalSection
          title="Tipo de Serviço"
          icon={<Wrench className="h-3 w-3" />}
        >
          {appointment.tipoServico}
        </DetailModalSection>

        <DetailModalSection
          title="Descrição"
          icon={<FileText className="h-3 w-3" />}
        >
          {appointment.descricao}
        </DetailModalSection>

        <DetailModalSection
          title="Status"
          icon={<BarChart3 className="h-3 w-3" />}
        >
          {getStatusBadge(appointment.statusFilter)}
        </DetailModalSection>

        <DetailModalSection
          title="Data"
          icon={<Calendar className="h-3 w-3" />}
        >
          {appointment.data}
        </DetailModalSection>

        <DetailModalSection
          title="Horário"
          icon={<Clock className="h-3 w-3" />}
        >
          {appointment.horario}
        </DetailModalSection>

        <DetailModalSection
          title="Localização"
          icon={<MapPin className="h-3 w-3" />}
        >
          {appointment.localizacao}
        </DetailModalSection>

        {appointment.valor && (
          <DetailModalSection
            title="Valor"
            icon={<FileText className="h-3 w-3" />}
          >
            {formatCurrency(appointment.valor)}
          </DetailModalSection>
        )}

        {appointment.avaliacao && (
          <DetailModalSection
            title="Avaliação"
            icon={<BarChart3 className="h-3 w-3" />}
          >
            <div className="flex items-center gap-1">
              <span className="font-medium">{appointment.avaliacao}/5</span>
            </div>
          </DetailModalSection>
        )}

        {appointment.observacoes && (
          <DetailModalSection
            title="Observações"
            icon={<FileText className="h-3 w-3" />}
          >
            {appointment.observacoes}
          </DetailModalSection>
        )}
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-48 bg-muted rounded animate-pulse" />
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
        Erro ao carregar agendamentos. Tente novamente.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Período:</label>
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
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Generic Table */}
      <GenericTable
        title="Lista de Agendamentos"
        icon={<Calendar className="h-5 w-5" />}
        data={transformedAppointments as unknown as Record<string, unknown>[]}
        columns={columns}
        actions={customActions}
        searchPlaceholder="Buscar por ID, cliente, descrição ou tipo de serviço..."
        sortOptions={[
          { value: "id", label: "ID" },
          { value: "cliente", label: "Cliente" },
          { value: "tipoServico", label: "Tipo de Serviço" },
          { value: "data", label: "Data" },
          { value: "status", label: "Status" },
          { value: "valor", label: "Valor" },
        ]}
        filterOptions={[
          { value: "todos", label: "Todos os status" },
          { value: "agendado", label: "Agendado" },
          { value: "confirmado", label: "Confirmado" },
          { value: "em_andamento", label: "Em Andamento" },
          { value: "concluido", label: "Concluído" },
          { value: "cancelado", label: "Cancelado" },
        ]}
        detailModalContent={(row) =>
          detailModalContent(row as unknown as TransformedAppointment)
        }
      />
    </div>
  );
}
