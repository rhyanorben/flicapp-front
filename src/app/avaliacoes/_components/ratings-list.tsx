"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Star, 
  Search, 
  Calendar,
  User,
  MessageSquare,
  Filter
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Rating {
  id: string
  cliente: string
  foto?: string
  nota: number
  comentario: string
  data: string
  servico: string
  resposta?: string
}

export function RatingsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("todos")
  const [periodFilter, setPeriodFilter] = useState("todos")

  // Dados mockados - em produção viria da API
  const ratings: Rating[] = [
    {
      id: "RAT-001",
      cliente: "Ana Silva",
      foto: "/api/placeholder/40/40",
      nota: 5,
      comentario: "Excelente trabalho! Muito pontual e organizado. Recomendo para todos!",
      data: "2024-01-15",
      servico: "Limpeza Residencial",
      resposta: "Obrigado, Ana! Foi um prazer atendê-la. Estou sempre disponível para novos serviços."
    },
    {
      id: "RAT-002",
      cliente: "João Santos",
      foto: "/api/placeholder/40/40",
      nota: 4,
      comentario: "Bom serviço, resolveu o problema do ar condicionado rapidamente.",
      data: "2024-01-14",
      servico: "Manutenção AC"
    },
    {
      id: "RAT-003",
      cliente: "Maria Costa",
      foto: "/api/placeholder/40/40",
      nota: 5,
      comentario: "Instalação perfeita! Muito profissional e educado.",
      data: "2024-01-12",
      servico: "Instalação Ventilador"
    },
    {
      id: "RAT-004",
      cliente: "Pedro Oliveira",
      foto: "/api/placeholder/40/40",
      nota: 4,
      comentario: "Ótimas dicas para organização. Serviço muito útil.",
      data: "2024-01-10",
      servico: "Consultoria Organização"
    },
    {
      id: "RAT-005",
      cliente: "Carla Mendes",
      foto: "/api/placeholder/40/40",
      nota: 3,
      comentario: "Serviço realizado conforme esperado, mas poderia ter sido mais rápido.",
      data: "2024-01-08",
      servico: "Reparo Eletrodoméstico"
    },
    {
      id: "RAT-006",
      cliente: "Roberto Lima",
      foto: "/api/placeholder/40/40",
      nota: 5,
      comentario: "Limpeza impecável! Casa ficou como nova. Super recomendo!",
      data: "2024-01-05",
      servico: "Limpeza Pós-Obra"
    }
  ]

  const getStarDisplay = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-4 w-4 ${
            i <= rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-gray-300'
          }`} 
        />
      )
    }
    return stars
  }

  const getPeriodFilter = (date: string) => {
    const ratingDate = new Date(date)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - ratingDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 7) return "7dias"
    if (diffDays <= 30) return "30dias"
    if (diffDays <= 90) return "90dias"
    return "mais90dias"
  }

  const filteredRatings = ratings.filter(rating => {
    const matchesSearch = rating.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rating.comentario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rating.servico.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRating = ratingFilter === "todos" || rating.nota.toString() === ratingFilter
    const matchesPeriod = periodFilter === "todos" || getPeriodFilter(rating.data) === periodFilter
    
    return matchesSearch && matchesRating && matchesPeriod
  })

  const handleReply = (ratingId: string) => {
    console.log("Responder avaliação:", ratingId)
    // Implementar modal de resposta
  }

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase()
  }

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
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todas as notas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as notas</SelectItem>
                <SelectItem value="5">5 estrelas</SelectItem>
                <SelectItem value="4">4 estrelas</SelectItem>
                <SelectItem value="3">3 estrelas</SelectItem>
                <SelectItem value="2">2 estrelas</SelectItem>
                <SelectItem value="1">1 estrela</SelectItem>
              </SelectContent>
            </Select>
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos os períodos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os períodos</SelectItem>
                <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="90dias">Últimos 90 dias</SelectItem>
                <SelectItem value="mais90dias">Mais de 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredRatings.map((rating) => (
            <div key={rating.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={rating.foto} alt={rating.cliente} />
                  <AvatarFallback>{getInitials(rating.cliente)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{rating.cliente}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getStarDisplay(rating.nota)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700">{rating.comentario}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(rating.data).toLocaleDateString('pt-BR')}
                    </div>
                    <span>{rating.servico}</span>
                  </div>
                  
                  {rating.resposta && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="text-xs font-medium text-blue-800 mb-1">Sua resposta:</div>
                      <p className="text-sm text-blue-700">{rating.resposta}</p>
                    </div>
                  )}
                  
                  {!rating.resposta && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReply(rating.id)}
                      className="mt-2"
                    >
                      Responder
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredRatings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma avaliação encontrada com os filtros aplicados.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
