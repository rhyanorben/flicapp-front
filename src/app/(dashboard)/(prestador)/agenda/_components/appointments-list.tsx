"use client";

import { useMemo } from "react";
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
} from "lucide-react";
import {
  GenericTable,
  TableColumn,
  TableAction,
} from "@/components/ui/generic-table";
import { DetailModalSection } from "@/components/ui/detail-modal";

interface Appointment {
  id: string;
  cliente: string;
  tipoServico: string;
  descricao: string;
  data: string;
  horario: string;
  localizacao: string;
  status: "agendado" | "confirmado" | "concluido" | "cancelado";
  observacoes?: string;
}

export function AppointmentsList() {
  // Dados mockados - em produção viria da API
  const appointments: Appointment[] = useMemo(
    () => [
      {
        id: "APT-001",
        cliente: "Ana Silva",
        tipoServico: "Limpeza",
        descricao: "Limpeza residencial completa",
        data: "2024-01-15",
        horario: "09:00",
        localizacao: "São Paulo, SP",
        status: "confirmado",
        observacoes: "Apartamento térreo, portão azul",
      },
      {
        id: "APT-002",
        cliente: "João Santos",
        tipoServico: "Manutenção",
        descricao: "Reparo no ar condicionado",
        data: "2024-01-15",
        horario: "14:00",
        localizacao: "São Paulo, SP",
        status: "agendado",
        observacoes: "AC não está gelando",
      },
      {
        id: "APT-003",
        cliente: "Maria Costa",
        tipoServico: "Instalação",
        descricao: "Instalação de ventilador",
        data: "2024-01-16",
        horario: "10:30",
        localizacao: "São Paulo, SP",
        status: "concluido",
        observacoes: "Ventilador de teto",
      },
      {
        id: "APT-004",
        cliente: "Pedro Oliveira",
        tipoServico: "Consultoria",
        descricao: "Consultoria em organização",
        data: "2024-01-18",
        horario: "16:00",
        localizacao: "São Paulo, SP",
        status: "cancelado",
        observacoes: "Cliente cancelou por motivos pessoais",
      },
      {
        id: "APT-005",
        cliente: "Carla Mendes",
        tipoServico: "Reparo",
        descricao: "Reparo de eletrodoméstico",
        data: "2024-01-20",
        horario: "08:00",
        localizacao: "São Paulo, SP",
        status: "agendado",
        observacoes: "Micro-ondas não está funcionando",
      },
      {
        id: "APT-006",
        cliente: "Roberto Lima",
        tipoServico: "Limpeza",
        descricao: "Limpeza pós-obra",
        data: "2024-01-22",
        horario: "13:30",
        localizacao: "São Paulo, SP",
        status: "agendado",
        observacoes: "Casa em reforma, muito pó",
      },
    ],
    []
  );

  // Configuração das colunas
  const columns: TableColumn[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "cliente", label: "Cliente", sortable: true },
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
    { key: "data", label: "Data", sortable: true },
    { key: "horario", label: "Horário", sortable: true },
    { key: "localizacao", label: "Localização" },
    { key: "status", label: "Status", sortable: true },
  ];

  // Ações customizadas específicas para agendamentos
  const customActions: TableAction[] = [
    {
      id: "confirm",
      label: "Confirmar Agendamento",
      icon: ({ className }) => <Check className={className} />,
      onClick: (appointment) =>
        console.log("Confirmar agendamento:", appointment.id),
      variant: "success",
      show: (appointment) => appointment.status === "agendado",
    },
    {
      id: "cancel",
      label: "Cancelar Agendamento",
      icon: ({ className }) => <X className={className} />,
      onClick: (appointment) =>
        console.log("Cancelar agendamento:", appointment.id),
      variant: "destructive",
      show: (appointment) => appointment.status === "agendado",
    },
    {
      id: "contact",
      label: "Contatar Cliente",
      icon: ({ className }) => <MessageSquare className={className} />,
      onClick: (appointment) =>
        console.log("Contatar cliente:", appointment.id),
      variant: "default",
      show: (appointment) =>
        appointment.status === "confirmado" ||
        appointment.status === "agendado",
    },
  ];

  // Conteúdo do modal de detalhes
  const detailModalContent = (appointment: Appointment) => (
    <>
      <DetailModalSection title="ID do Agendamento">
        {appointment.id}
      </DetailModalSection>
      <DetailModalSection title="Cliente" icon={<User className="h-3 w-3" />}>
        {appointment.cliente}
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
        {appointment.status}
      </DetailModalSection>
      <DetailModalSection title="Data" icon={<Calendar className="h-3 w-3" />}>
        {new Date(appointment.data).toLocaleDateString("pt-BR")}
      </DetailModalSection>
      <DetailModalSection title="Horário" icon={<Clock className="h-3 w-3" />}>
        {appointment.horario}
      </DetailModalSection>
      <DetailModalSection
        title="Localização"
        icon={<MapPin className="h-3 w-3" />}
      >
        {appointment.localizacao}
      </DetailModalSection>
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

  return (
    <GenericTable
      title="Lista de Agendamentos"
      icon={<Calendar className="h-5 w-5" />}
      data={appointments as unknown as Record<string, unknown>[]}
      columns={columns}
      actions={customActions}
      searchPlaceholder="Buscar por ID, cliente, descrição ou tipo de serviço..."
      sortOptions={[
        { value: "id", label: "ID" },
        { value: "cliente", label: "Cliente" },
        { value: "tipoServico", label: "Tipo de Serviço" },
        { value: "data", label: "Data" },
        { value: "status", label: "Status" },
      ]}
      filterOptions={[
        { value: "todos", label: "Todos os status" },
        { value: "agendado", label: "Agendado" },
        { value: "confirmado", label: "Confirmado" },
        { value: "concluido", label: "Concluído" },
        { value: "cancelado", label: "Cancelado" },
      ]}
      detailModalContent={(row) =>
        detailModalContent(row as unknown as Appointment)
      }
    />
  );
}
