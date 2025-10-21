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
  History,
  User,
  Calendar
} from "lucide-react"

interface HistoryOrder {
  id: string
  tipoServico: string
  descricao: string
  status: 'concluido' | 'cancelado'
  data: string
  prestador: string
  avaliacao?: number
  dataFinalizacao: string
}

export function HistoryTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [periodFilter, setPeriodFilter] = useState("todos")

  // Dados mockados - em produção viria da API
  const historyOrders: HistoryOrder[] = [
    {
      id: "PED-001",
      tipoServico: "Limpeza",
      descricao: "Limpeza residencial completa",
      status: "concluido",
      data: "2024-01-15",
      prestador: "João Silva",
      avaliacao: 5,
      dataFinalizacao: "2024-01-16"
    },
    {
      id: "PED-002",
      tipoServico: "Manutenção",
      descricao: "Reparo no ar condicionado",
      status: "concluido",
      data: "2024-01-10",
      prestador: "Maria Santos",
      avaliacao: 4,
      dataFinalizacao: "2024-01-12"
    },
    {
      id: "PED-003",
      tipoServico: "Instalação",
      descricao: "Instalação de ventilador",
      status: "concluido",
      data: "2024-01-05",
      prestador: "Pedro Costa",
      dataFinalizacao: "2024-01-07"
    },
    {
      id: "PED-004",
      tipoServico: "Consultoria",
      descricao: "Consultoria em organização",
      status: "cancelado",
      data: "2024-01-02",
      prestador: "Ana Oliveira",
      dataFinalizacao: "2024-01-03"
    },
    {
      id: "PED-005",
      tipoServico: "Reparo",
      descricao: "Reparo de eletrodoméstico",
      status: "concluido",
      data: "2023-12-28",
      prestador: "Carlos Mendes",
      avaliacao: 3,
      dataFinalizacao: "2023-12-30"
    }
  ]

  const getStatusBadge = (status: HistoryOrder['status']) => {
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
    const orderDate = new Date(date)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - orderDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 7) return "7dias"
    if (diffDays <= 30) return "30dias"
    if (diffDays <= 90) return "90dias"
    return "mais90dias"
  }

  const filteredOrders = historyOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.prestador.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "todos" || order.status === statusFilter
    const matchesPeriod = periodFilter === "todos" || getPeriodFilter(order.data) === periodFilter
    
    return matchesSearch && matchesStatus && matchesPeriod
  })

  const handleViewDetails = (orderId: string) => {
    console.log("Ver detalhes do pedido:", orderId)
    // Implementar modal ou navegação para detalhes
  }

  const handleRateOrder = (orderId: string) => {
    console.log("Avaliar pedido:", orderId)
    // Implementar modal de avaliação
  }

  const handleViewRating = (orderId: string) => {
    console.log("Ver avaliação do pedido:", orderId)
    // Implementar modal para visualizar avaliação
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Histórico de Pedidos
        </CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por ID, descrição ou prestador..."
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
                <TableHead>Tipo de Serviço</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status Final</TableHead>
                <TableHead>Data Pedido</TableHead>
                <TableHead>Data Finalização</TableHead>
                <TableHead>Prestador</TableHead>
                <TableHead>Avaliação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.tipoServico}</TableCell>
                  <TableCell className="max-w-xs truncate">{order.descricao}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {new Date(order.data).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {new Date(order.dataFinalizacao).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    {order.prestador}
                  </TableCell>
                  <TableCell>
                    {order.avaliacao ? (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{order.avaliacao}</span>
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
                        onClick={() => handleViewDetails(order.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {order.status === 'concluido' && !order.avaliacao && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRateOrder(order.id)}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {order.status === 'concluido' && order.avaliacao && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewRating(order.id)}
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
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum pedido encontrado no histórico com os filtros aplicados.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
