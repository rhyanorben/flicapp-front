"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Heart, 
  Star, 
  Search, 
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Eye,
  MessageSquare
} from "lucide-react"

interface FavoriteProvider {
  id: string
  nome: string
  foto?: string
  tipoServico: string
  avaliacaoMedia: number
  numServicos: number
  telefone: string
  email: string
  localizacao: string
  especialidades: string[]
}

export function FavoritesGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const [serviceFilter, setServiceFilter] = useState("todos")
  const [ratingFilter, setRatingFilter] = useState("todos")

  // Dados mockados - em produção viria da API
  const favoriteProviders: FavoriteProvider[] = [
    {
      id: "PROV-001",
      nome: "João Silva",
      foto: "/api/placeholder/100/100",
      tipoServico: "Limpeza",
      avaliacaoMedia: 4.8,
      numServicos: 45,
      telefone: "(11) 99999-1111",
      email: "joao@email.com",
      localizacao: "São Paulo, SP",
      especialidades: ["Limpeza Residencial", "Limpeza Comercial", "Pós-Obra"]
    },
    {
      id: "PROV-002",
      nome: "Maria Santos",
      foto: "/api/placeholder/100/100",
      tipoServico: "Manutenção",
      avaliacaoMedia: 4.9,
      numServicos: 32,
      telefone: "(11) 99999-2222",
      email: "maria@email.com",
      localizacao: "São Paulo, SP",
      especialidades: ["Ar Condicionado", "Eletrodomésticos", "Hidráulica"]
    },
    {
      id: "PROV-003",
      nome: "Pedro Costa",
      foto: "/api/placeholder/100/100",
      tipoServico: "Instalação",
      avaliacaoMedia: 4.7,
      numServicos: 28,
      telefone: "(11) 99999-3333",
      email: "pedro@email.com",
      localizacao: "São Paulo, SP",
      especialidades: ["Ventiladores", "Lâmpadas", "Tomadas"]
    },
    {
      id: "PROV-004",
      nome: "Ana Oliveira",
      foto: "/api/placeholder/100/100",
      tipoServico: "Consultoria",
      avaliacaoMedia: 4.6,
      numServicos: 15,
      telefone: "(11) 99999-4444",
      email: "ana@email.com",
      localizacao: "São Paulo, SP",
      especialidades: ["Organização", "Decoração", "Feng Shui"]
    },
    {
      id: "PROV-005",
      nome: "Carlos Mendes",
      foto: "/api/placeholder/100/100",
      tipoServico: "Reparo",
      avaliacaoMedia: 4.5,
      numServicos: 38,
      telefone: "(11) 99999-5555",
      email: "carlos@email.com",
      localizacao: "São Paulo, SP",
      especialidades: ["Eletrônicos", "Computadores", "Smartphones"]
    }
  ]

  const filteredProviders = favoriteProviders.filter(provider => {
    const matchesSearch = provider.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.tipoServico.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.especialidades.some(esp => esp.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesService = serviceFilter === "todos" || provider.tipoServico === serviceFilter
    const matchesRating = ratingFilter === "todos" || 
                         (ratingFilter === "4+" && provider.avaliacaoMedia >= 4) ||
                         (ratingFilter === "4.5+" && provider.avaliacaoMedia >= 4.5) ||
                         (ratingFilter === "5" && provider.avaliacaoMedia === 5)
    
    return matchesSearch && matchesService && matchesRating
  })

  const handleRemoveFavorite = (providerId: string) => {
    console.log("Remover dos favoritos:", providerId)
    // Implementar lógica de remoção
  }

  const handleViewProfile = (providerId: string) => {
    console.log("Ver perfil do prestador:", providerId)
    // Implementar navegação para perfil
  }

  const handleRequestService = (providerId: string) => {
    console.log("Solicitar serviço para:", providerId)
    // Implementar navegação para solicitação de serviço
  }

  const handleContact = (providerId: string, type: 'phone' | 'email') => {
    console.log(`Contatar prestador ${providerId} via ${type}`)
    // Implementar lógica de contato
  }

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Prestadores Favoritos
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, tipo de serviço ou especialidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="todos">Todos os tipos</option>
                <option value="Limpeza">Limpeza</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Instalação">Instalação</option>
                <option value="Consultoria">Consultoria</option>
                <option value="Reparo">Reparo</option>
              </select>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="todos">Todas as avaliações</option>
                <option value="4+">4+ estrelas</option>
                <option value="4.5+">4.5+ estrelas</option>
                <option value="5">5 estrelas</option>
              </select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProviders.map((provider) => (
          <Card key={provider.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={provider.foto} alt={provider.nome} />
                    <AvatarFallback>{getInitials(provider.nome)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{provider.nome}</CardTitle>
                    <p className="text-sm text-muted-foreground">{provider.tipoServico}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFavorite(provider.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{provider.avaliacaoMedia}</span>
                <span className="text-sm text-muted-foreground">
                  ({provider.numServicos} serviços)
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {provider.localizacao}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  {provider.especialidades.slice(0, 2).join(", ")}
                  {provider.especialidades.length > 2 && "..."}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleContact(provider.id, 'phone')}
                  className="flex-1"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Ligar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleContact(provider.id, 'email')}
                  className="flex-1"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewProfile(provider.id)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver Perfil
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleRequestService(provider.id)}
                  className="flex-1"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Solicitar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum favorito encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || serviceFilter !== "todos" || ratingFilter !== "todos"
                ? "Tente ajustar os filtros de busca."
                : "Você ainda não tem prestadores favoritos. Adicione alguns para vê-los aqui."}
            </p>
            {!searchTerm && serviceFilter === "todos" && ratingFilter === "todos" && (
              <Button onClick={() => console.log("Navegar para busca de prestadores")}>
                Buscar Prestadores
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
