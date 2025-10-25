"use client";

import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Calendar,
  MessageSquare,
  User,
  Wrench,
  FileText,
} from "lucide-react";
import {
  GenericTable,
  TableColumn,
  TableAction,
} from "@/components/ui/generic-table";
import { DetailModalSection } from "@/components/ui/detail-modal";

interface Rating {
  id: string;
  cliente: string;
  foto?: string;
  nota: number;
  comentario: string;
  data: string;
  servico: string;
  resposta?: string;
}

export function RatingsList() {
  // Dados mockados - em produção viria da API
  const ratings: Rating[] = useMemo(
    () => [
      {
        id: "RAT-001",
        cliente: "Ana Silva",
        foto: "/api/placeholder/40/40",
        nota: 5,
        comentario:
          "Excelente trabalho! Muito pontual e organizado. Recomendo para todos!",
        data: "2024-01-15",
        servico: "Limpeza Residencial",
        resposta:
          "Obrigado, Ana! Foi um prazer atendê-la. Estou sempre disponível para novos serviços.",
      },
      {
        id: "RAT-002",
        cliente: "João Santos",
        foto: "/api/placeholder/40/40",
        nota: 4,
        comentario:
          "Bom serviço, resolveu o problema do ar condicionado rapidamente.",
        data: "2024-01-14",
        servico: "Manutenção AC",
      },
      {
        id: "RAT-003",
        cliente: "Maria Costa",
        foto: "/api/placeholder/40/40",
        nota: 5,
        comentario: "Instalação perfeita! Muito profissional e educado.",
        data: "2024-01-12",
        servico: "Instalação Ventilador",
      },
      {
        id: "RAT-004",
        cliente: "Pedro Oliveira",
        foto: "/api/placeholder/40/40",
        nota: 4,
        comentario: "Ótimas dicas para organização. Serviço muito útil.",
        data: "2024-01-10",
        servico: "Consultoria Organização",
      },
      {
        id: "RAT-005",
        cliente: "Carla Mendes",
        foto: "/api/placeholder/40/40",
        nota: 3,
        comentario:
          "Serviço realizado conforme esperado, mas poderia ter sido mais rápido.",
        data: "2024-01-08",
        servico: "Reparo Eletrodoméstico",
      },
      {
        id: "RAT-006",
        cliente: "Roberto Lima",
        foto: "/api/placeholder/40/40",
        nota: 5,
        comentario: "Limpeza impecável! Casa ficou como nova. Super recomendo!",
        data: "2024-01-05",
        servico: "Limpeza Pós-Obra",
      },
    ],
    []
  );

  const getStarDisplay = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  const getInitials = (nome: string) => {
    return nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Configuração das colunas
  const columns: TableColumn[] = [
    { key: "cliente", label: "Cliente", sortable: true },
    {
      key: "nota",
      label: "Avaliação",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">{String(value)}/5</span>
        </div>
      ),
    },
    {
      key: "comentario",
      label: "Comentário",
      width: "400px",
      render: (value) => (
        <span className="text-sm text-foreground truncate block max-w-[380px]">
          {String(value || "-")}
        </span>
      ),
    },
    { key: "data", label: "Data", sortable: true },
  ];

  // Ações customizadas específicas para avaliações
  const customActions: TableAction[] = [
    {
      id: "reply",
      label: "Responder Avaliação",
      icon: ({ className }) => <MessageSquare className={className} />,
      onClick: (rating) => console.log("Responder avaliação:", rating.id),
      variant: "default",
      show: (rating) => !rating.resposta,
    },
    {
      id: "view-reply",
      label: "Ver Resposta",
      icon: ({ className }) => <MessageSquare className={className} />,
      onClick: (rating) => console.log("Ver resposta:", rating.id),
      variant: "success",
      show: (rating) => !!rating.resposta,
    },
  ];

  // Conteúdo do modal de detalhes
  const detailModalContent = (rating: Rating) => (
    <>
      <DetailModalSection title="ID da Avaliação">
        {rating.id}
      </DetailModalSection>
      <DetailModalSection title="Cliente" icon={<User className="h-3 w-3" />}>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={rating.foto} alt={rating.cliente} />
            <AvatarFallback>{getInitials(rating.cliente)}</AvatarFallback>
          </Avatar>
          <span>{rating.cliente}</span>
        </div>
      </DetailModalSection>
      <DetailModalSection title="Serviço" icon={<Wrench className="h-3 w-3" />}>
        {rating.servico}
      </DetailModalSection>
      <DetailModalSection title="Data" icon={<Calendar className="h-3 w-3" />}>
        {new Date(rating.data).toLocaleDateString("pt-BR")}
      </DetailModalSection>
      <DetailModalSection title="Avaliação" icon={<Star className="h-3 w-3" />}>
        <div className="flex items-center gap-1">
          {getStarDisplay(rating.nota)}
          <span className="ml-2">{rating.nota}/5</span>
        </div>
      </DetailModalSection>
      <DetailModalSection
        title="Comentário"
        icon={<FileText className="h-3 w-3" />}
      >
        {rating.comentario}
      </DetailModalSection>
      {rating.resposta && (
        <DetailModalSection
          title="Sua Resposta"
          icon={<MessageSquare className="h-3 w-3" />}
        >
          {rating.resposta}
        </DetailModalSection>
      )}
    </>
  );

  return (
    <GenericTable
      title="Avaliações Recentes"
      icon={<MessageSquare className="h-5 w-5" />}
      data={ratings as unknown as Record<string, unknown>[]}
      columns={columns}
      actions={customActions}
      searchPlaceholder="Buscar por cliente, comentário ou serviço..."
      sortOptions={[
        { value: "cliente", label: "Cliente" },
        { value: "data", label: "Data" },
        { value: "nota", label: "Avaliação" },
      ]}
      filterOptions={[
        { value: "todos", label: "Todas as notas" },
        { value: "5", label: "5 estrelas" },
        { value: "4", label: "4 estrelas" },
        { value: "3", label: "3 estrelas" },
        { value: "2", label: "2 estrelas" },
        { value: "1", label: "1 estrela" },
      ]}
      detailModalContent={(row) => detailModalContent(row as unknown as Rating)}
    />
  );
}
