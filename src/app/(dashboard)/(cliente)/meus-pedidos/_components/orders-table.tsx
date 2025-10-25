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

interface Order {
  id: string;
  tipoServico: string;
  descricao: string;
  status: "aguardando" | "em-andamento" | "concluido" | "cancelado";
  data: string;
  prestador: string;
  avaliacao?: number;
  valor?: number;
  localizacao?: string;
}

export function OrdersTable() {
  // Dados mockados - em produção viria da API
  const orders: Order[] = useMemo(
    () => [
      {
        id: "PED-001",
        tipoServico: "Limpeza",
        descricao: "Limpeza residencial completa",
        status: "aguardando",
        data: "2024-01-15",
        prestador: "João Silva",
        valor: 150.0,
        localizacao: "São Paulo, SP",
      },
      {
        id: "PED-002",
        tipoServico: "Manutenção",
        descricao: "Reparo no ar condicionado",
        status: "em-andamento",
        data: "2024-01-14",
        prestador: "Maria Santos",
        valor: 200.0,
        localizacao: "São Paulo, SP",
      },
      {
        id: "PED-003",
        tipoServico: "Instalação",
        descricao: "Instalação de ventilador",
        status: "concluido",
        data: "2024-01-10",
        prestador: "Pedro Costa",
        avaliacao: 5,
        valor: 120.0,
        localizacao: "São Paulo, SP",
      },
      {
        id: "PED-004",
        tipoServico: "Consultoria",
        descricao: "Consultoria em organização",
        status: "cancelado",
        data: "2024-01-08",
        prestador: "Ana Oliveira",
        valor: 80.0,
        localizacao: "São Paulo, SP",
      },
    ],
    []
  );

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
      show: (order) => order.status === "aguardando",
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
      show: (order) => order.status === "concluido" && !order.avaliacao,
    },
  ];

  // Conteúdo do modal de detalhes
  const detailModalContent = (order: Order) => (
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

  return (
    <GenericTable
      title="Pedidos Recentes"
      icon={<Calendar className="h-5 w-5" />}
      data={orders as unknown as Record<string, unknown>[]}
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
      detailModalContent={(row) => detailModalContent(row as unknown as Order)}
    />
  );
}
