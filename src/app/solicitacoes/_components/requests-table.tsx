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
  Check, 
  X, 
  Search, 
  MessageSquare,
  User,
  Calendar,
  DollarSign,
  MapPin
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Request {
  id: string
  cliente: string
  tipoServico: string
  descricao: string
  dataSolicitacao: string
  dataPreferencial: string
  localizacao: string
  valor: number
  status: 'pendente' | 'aceita' | 'recusada' | 'expirada'
  prazoResposta: string
}

export function RequestsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  // Dados mockados - em produção viria da API
  const requests: Request[] = [
    {
      id: "REQ-001",
      cliente: "Ana Silva",
      tipoServico: "Limpeza",
      descricao: "Limpeza residencial completa",
      dataSolicitacao: "2024-01-15",
      dataPreferencial: "2024-01-20",
      localizacao: "São Paulo, SP",
      valor: 150.00,
      status: "pendente",
      prazoResposta: "2024-01-16"
    },
    {
      id: "REQ-002",
      cliente: "João Santos",
      tipoServico: "Manutenção",
      descricao: "Reparo no ar condicionado",
      dataSolicitacao: "2024-01-14",
      dataPreferencial: "2024-01-18",
      localizacao: "São Paulo, SP",
      valor: 200.00,
      status: "pendente",
      prazoResposta: "2024-01-15"
    },
    {
      id: "REQ-003",
      cliente: "Maria Costa",
      tipoServico: "Instalação",
      descricao: "Instalação de ventilador",
      dataSolicitacao: "2024-01-13",
      dataPreferencial: "2024-01-17",
      localizacao: "São Paulo, SP",
      valor: 120.00,
      status: "aceita",
      prazoResposta: "2024-01-14"
    },
    {
      id: "REQ-004",
      cliente: "Pedro Oliveira",
      tipoServico: "Consultoria",
      descricao: "Consultoria em organização",
      dataSolicitacao: "2024-01-12",
      dataPreferencial: "2024-01-16",
      localizacao: "São Paulo, SP",
      valor: 80.00,
      status: "aceita",
      prazoResposta: "2024-01-13"
    },
    {
      id: "REQ-005",
      cliente: "Carla Mendes",
      tipoServico: "Reparo",
      descricao: "Reparo de eletrodoméstico",
      dataSolicitacao: "2024-01-11",
      dataPreferencial: "2024-01-15",
      localizacao: "São Paulo, SP",
      valor: 90.00,
      status: "recusada",
      prazoResposta: "2024-01-12"
    },
    {
      id: "REQ-006",
      cliente: "Roberto Lima",
      tipoServico: "Limpeza",
      descricao: "Limpeza pós-obra",
      dataSolicitacao: "2024-01-10",
      dataPreferencial: "2024-01-14",
      localizacao: "São Paulo, SP",
      valor: 300.00,
      status: "expirada",
      prazoResposta: "2024-01-11"
    }
  ]

  const getStatusBadge = (status: Request['status']) => {
    const statusConfig = {
      pendente: { label: "Pendente", variant: "secondary" as const },
      aceita: { label: "Aceita", variant: "default" as const },
      recusada: { label: "Recusada", variant: "destructive" as const },
      expirada: { label: "Expirada", variant: "outline" as const }
    }
    
    const config = statusConfig[status]
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    )
  }

  // Ordenar para mostrar pendentes primeiro
  const sortedRequests = requests.sort((a, b) => {
    if (a.status === 'pendente' && b.status !== 'pendente') return -1
    if (a.status !== 'pendente' && b.status === 'pendente') return 1
    return new Date(b.dataSolicitacao).getTime() - new Date(a.dataSolicitacao).getTime()
  })

  const filteredRequests = sortedRequests.filter(request => {
    const matchesSearch = request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.tipoServico.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "todos" || request.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (requestId: string) => {
    console.log("Ver detalhes da solicitação:", requestId)
    // Implementar modal ou navegação para detalhes
  }

  const handleAcceptRequest = (requestId: string) => {
    console.log("Aceitar solicitação:", requestId)
    // Implementar lógica de aceitação
  }

  const handleRejectRequest = (requestId: string) => {
    console.log("Recusar solicitação:", requestId)
    // Implementar lógica de recusa
  }

  const handleContactClient = (requestId: string) => {
    console.log("Contatar cliente:", requestId)
    // Implementar modal de contato
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
          <MessageSquare className="h-5 w-5" />
          Todas as Solicitações
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="aceita">Aceita</SelectItem>
                <SelectItem value="recusada">Recusada</SelectItem>
                <SelectItem value="expirada">Expirada</SelectItem>
              </SelectContent>
            </Select>
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
                <TableHead>Data Solicitação</TableHead>
                <TableHead>Data Preferencial</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id} className={request.status === 'pendente' ? 'bg-orange-50' : ''}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    {request.cliente}
                  </TableCell>
                  <TableCell>{request.tipoServico}</TableCell>
                  <TableCell className="max-w-xs truncate">{request.descricao}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {new Date(request.dataSolicitacao).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {new Date(request.dataPreferencial).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {request.localizacao}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    {formatCurrency(request.valor)}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(request.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {request.status === 'pendente' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcceptRequest(request.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectRequest(request.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      {request.status === 'aceita' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContactClient(request.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredRequests.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma solicitação encontrada com os filtros aplicados.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
