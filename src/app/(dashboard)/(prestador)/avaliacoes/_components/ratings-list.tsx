"use client";

import { useMemo, useState } from "react";
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
import { useRatings } from "@/hooks/use-ratings";
import { formatDate } from "@/lib/utils/table-utils";

interface TransformedRating {
  id: string;
  cliente: string;
  foto?: string;
  nota: number;
  comentario: string;
  data: string;
  servico: string;
  resposta?: string;
  originalRating: Record<string, unknown>;
}

export function RatingsList() {
  const [periodFilter, setPeriodFilter] = useState("todos");
  const [ratingFilter, setRatingFilter] = useState("todos");
  const {
    data: ratings,
    isLoading,
    error,
  } = useRatings(periodFilter, ratingFilter);

  // Transform ratings for display
  const transformedRatings = useMemo(() => {
    if (!ratings) return [];

    return ratings.map((rating, index) => ({
      id: rating.id || `rating-${index}-${Date.now()}`, // Generate unique ID if missing
      cliente: rating.order.client.name,
      foto: rating.order.client.image || undefined,
      nota: rating.rating || 0,
      comentario: rating.comment || "",
      data: formatDate(rating.createdAt),
      servico: rating.order.category?.name || "Não especificado",
      resposta: undefined, // TODO: Implement provider responses
      // Keep original rating for actions
      originalRating: rating,
    }));
  }, [ratings]);

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

  // Period filter options
  const periodOptions = [
    { value: "todos", label: "Todos os períodos" },
    { value: "7dias", label: "Últimos 7 dias" },
    { value: "30dias", label: "Últimos 30 dias" },
    { value: "90dias", label: "Últimos 90 dias" },
    { value: "mais90dias", label: "Mais de 90 dias" },
  ];

  // Rating filter options
  const ratingOptions = [
    { value: "todos", label: "Todas as notas" },
    { value: "5", label: "5 estrelas" },
    { value: "4", label: "4 estrelas" },
    { value: "3", label: "3 estrelas" },
    { value: "2", label: "2 estrelas" },
    { value: "1", label: "1 estrela" },
  ];

  // Configuração das colunas
  const columns: TableColumn[] = [
    {
      key: "cliente",
      label: "Cliente",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={(row as any).foto} alt={String(value)} />
            <AvatarFallback>{getInitials(String(value))}</AvatarFallback>
          </Avatar>
          <span>{String(value)}</span>
        </div>
      ),
    },
    {
      key: "nota",
      label: "Avaliação",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1">
          {getStarDisplay(Number(value))}
          <span className="text-sm font-medium ml-1">{String(value)}/5</span>
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
    {
      key: "servico",
      label: "Serviço",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4 text-gray-400" />
          <span>{String(value)}</span>
        </div>
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
  ];

  const handleReplyRating = (ratingId: string) => {
    console.log("Responder avaliação:", ratingId);
    // Implementar resposta à avaliação
  };

  const handleViewReply = (ratingId: string) => {
    console.log("Ver resposta:", ratingId);
    // Implementar visualização da resposta
  };

  // Ações customizadas específicas para avaliações
  const customActions: TableAction[] = [
    {
      id: "reply",
      label: "Responder Avaliação",
      icon: ({ className }) => <MessageSquare className={className} />,
      onClick: (rating) => handleReplyRating(rating.id as string),
      variant: "default",
      show: (rating) => !(rating as any).resposta,
    },
    {
      id: "view-reply",
      label: "Ver Resposta",
      icon: ({ className }) => <MessageSquare className={className} />,
      onClick: (rating) => handleViewReply(rating.id as string),
      variant: "success",
      show: (rating) => !!(rating as any).resposta,
    },
  ];

  // Conteúdo do modal de detalhes
  const detailModalContent = (rating: TransformedRating) => {
    const originalRating = rating.originalRating as any;
    const order = originalRating?.order;

    return (
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
        <DetailModalSection
          title="Serviço"
          icon={<Wrench className="h-3 w-3" />}
        >
          {rating.servico}
        </DetailModalSection>
        <DetailModalSection
          title="Data"
          icon={<Calendar className="h-3 w-3" />}
        >
          {rating.data}
        </DetailModalSection>
        <DetailModalSection
          title="Avaliação"
          icon={<Star className="h-3 w-3" />}
        >
          <div className="flex items-center gap-1">
            {getStarDisplay(rating.nota)}
            <span className="ml-2">{rating.nota}/5</span>
          </div>
        </DetailModalSection>
        <DetailModalSection
          title="Comentário"
          icon={<FileText className="h-3 w-3" />}
        >
          {rating.comentario || "Sem comentário"}
        </DetailModalSection>
        {order?.description && (
          <DetailModalSection
            title="Descrição do Serviço"
            icon={<FileText className="h-3 w-3" />}
          >
            {order.description}
          </DetailModalSection>
        )}
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
        Erro ao carregar avaliações. Tente novamente.
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
          <label className="text-sm font-medium">Nota:</label>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            {ratingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Generic Table */}
      <GenericTable
        title="Avaliações Recentes"
        icon={<MessageSquare className="h-5 w-5" />}
        data={transformedRatings as unknown as Record<string, unknown>[]}
        columns={columns}
        actions={customActions}
        searchPlaceholder="Buscar por cliente, comentário ou serviço..."
        sortOptions={[
          { value: "cliente", label: "Cliente" },
          { value: "data", label: "Data" },
          { value: "nota", label: "Avaliação" },
          { value: "servico", label: "Serviço" },
        ]}
        filterOptions={[
          { value: "todos", label: "Todas as notas" },
          { value: "5", label: "5 estrelas" },
          { value: "4", label: "4 estrelas" },
          { value: "3", label: "3 estrelas" },
          { value: "2", label: "2 estrelas" },
          { value: "1", label: "1 estrela" },
        ]}
        detailModalContent={(row) =>
          detailModalContent(row as unknown as TransformedRating)
        }
      />
    </div>
  );
}
