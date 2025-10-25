"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Search, Calendar, MessageSquare } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("todos");
  const [periodFilter, setPeriodFilter] = useState("todos");

  // Dados mockados - em produção viria da API
  const ratings: Rating[] = [
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
  ];

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

  const getPeriodFilter = (date: string) => {
    const ratingDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - ratingDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return "7dias";
    if (diffDays <= 30) return "30dias";
    if (diffDays <= 90) return "90dias";
    return "mais90dias";
  };

  const filteredRatings = ratings.filter((rating) => {
    const matchesSearch =
      rating.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.comentario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.servico.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      ratingFilter === "todos" || rating.nota.toString() === ratingFilter;
    const matchesPeriod =
      periodFilter === "todos" || getPeriodFilter(rating.data) === periodFilter;

    return matchesSearch && matchesRating && matchesPeriod;
  });

  const handleReply = (ratingId: string) => {
    console.log("Responder avaliação:", ratingId);
    // Implementar modal de resposta
  };

  const getInitials = (nome: string) => {
    return nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Avaliações Recentes
        </CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por cliente, comentário ou serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="todos">Todas as notas</option>
              <option value="5">5 estrelas</option>
              <option value="4">4 estrelas</option>
              <option value="3">3 estrelas</option>
              <option value="2">2 estrelas</option>
              <option value="1">1 estrela</option>
            </select>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="todos">Todos os períodos</option>
              <option value="7dias">Últimos 7 dias</option>
              <option value="30dias">Últimos 30 dias</option>
              <option value="90dias">Últimos 90 dias</option>
              <option value="mais90dias">Mais de 90 dias</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Avaliação</TableHead>
                <TableHead>Comentário</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRatings.map((rating) => (
                <TableRow key={rating.id}>
                  <TableCell className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={rating.foto} alt={rating.cliente} />
                      <AvatarFallback>
                        {getInitials(rating.cliente)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{rating.cliente}</span>
                  </TableCell>
                  <TableCell>{rating.servico}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {new Date(rating.data).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getStarDisplay(rating.nota)}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {rating.comentario}
                  </TableCell>
                  <TableCell className="text-right">
                    {rating.resposta ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReply(rating.id)}
                        className="text-blue-600"
                      >
                        Ver Resposta
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReply(rating.id)}
                      >
                        Responder
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredRatings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma avaliação encontrada com os filtros aplicados.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
