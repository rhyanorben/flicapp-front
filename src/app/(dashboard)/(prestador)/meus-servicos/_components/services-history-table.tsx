"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Eye, 
  Star, 
  Search, 
  Briefcase,
  User,
  Calendar,
  DollarSign
} from "lucide-react"

interface ServiceHistory {
  id: string
  cliente: string
  tipoServico: string
  descricao: string
  dataRealizacao: string
  valor: number
  status: 'concluido' | 'cancelado'
  avaliacao?: number
  comentario?: string
}

export function ServicesHistoryTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [periodFilter, setPeriodFilter] = useState("todos")

  // Dados mockados - em produção viria da API
  const servicesHistory: ServiceHistory[] = [
    {
      id: "SERV-001",
      cliente: "Ana Silva",
      tipoServico: "Limpeza",
      descricao: "Limpeza residencial completa",
      dataRealizacao: "2024-01-15",
      valor: 150.00,
      status: "concluido",
      avaliacao: 5,
      comentario: "Excelente trabalho, muito pontual e organizado!"
    },
    {
      id: "SERV-002",
      cliente: "João Santos",
      tipoServico: "Manutenção",
      descricao: "Reparo no ar condicionado",
      dataRealizacao: "2024-01-14",
      valor: 200.00,
      status: "concluido",
      avaliacao: 4,
      comentario: "Resolveu o problema rapidamente."
    },
    {
      id: "SERV-003",
      cliente: "Maria Costa",
      tipoServico: "Instalação",
      descricao: "Instalação de ventilador",
      dataRealizacao: "2024-01-12",
      valor: 120.00,
      status: "concluido",
      avaliacao: 5,
      comentario: "Instalação perfeita, muito profissional!"
    },
    {
      id: "SERV-004",
      cliente: "Pedro Oliveira",
      tipoServico: "Consultoria",
      descricao: "Consultoria em organização",
      dataRealizacao: "2024-01-10",
      valor: 80.00,
      status: "concluido",
      avaliacao: 4,
      comentario: "Ótimas dicas para organização."
    },
    {
      id: "SERV-005",
      cliente: "Carla Mendes",
      tipoServico: "Reparo",
      descricao: "Reparo de eletrodoméstico",
      dataRealizacao: "2024-01-08",
      valor: 90.00,
      status: "concluido",
      avaliacao: 3,
      comentario: "Serviço realizado conforme esperado."
    },
    {
      id: "SERV-006",
      cliente: "Roberto Lima",
      tipoServico: "Limpeza",
      descricao: "Limpeza pós-obra",
      dataRealizacao: "2024-01-05",
      valor: 300.00,
      status: "cancelado"
    }
  ]

  const getStatusBadge = (status: ServiceHistory['status']) => {
    const statusConfig = {
      concluido: { label: "Concluído", color: "bg-green-100 text-green-800" },
      cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800" }
    }
    
    const config = statusConfig[status]
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getPeriodFilter = (date: string) => {
    const serviceDate = new Date(date)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - serviceDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 7) return "7dias"
    if (diffDays <= 30) return "30dias"
    if (diffDays <= 90) return "90dias"
    return "mais90dias"
  }

  const filteredServices = servicesHistory.filter(service => {
    const matchesSearch = service.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.tipoServico.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "todos" || service.status === statusFilter
    const matchesPeriod = periodFilter === "todos" || getPeriodFilter(service.dataRealizacao) === periodFilter
    
    return matchesSearch && matchesStatus && matchesPeriod
  })

  const handleViewDetails = (serviceId: string) => {
    console.log("Ver detalhes do serviço:", serviceId)
    // Implementar modal ou navegação para detalhes
  }

  const handleViewRating = (serviceId: string) => {
    console.log("Ver avaliação do serviço:", serviceId)
    // Implementar modal para visualizar avaliação
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Histórico de Serviços
        </CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por ID, cliente, descrição ou tipo de serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="todos">Todos os status</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
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
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo de Serviço</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Data Realização</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Avaliação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.id}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    {service.cliente}
                  </TableCell>
                  <TableCell>{service.tipoServico}</TableCell>
                  <TableCell className="max-w-xs truncate">{service.descricao}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {new Date(service.dataRealizacao).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    {formatCurrency(service.valor)}
                  </TableCell>
                  <TableCell>{getStatusBadge(service.status)}</TableCell>
                  <TableCell>
                    {service.avaliacao ? (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{service.avaliacao}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(service.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {service.status === 'concluido' && service.avaliacao && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewRating(service.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredServices.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum serviço encontrado no histórico com os filtros aplicados.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
