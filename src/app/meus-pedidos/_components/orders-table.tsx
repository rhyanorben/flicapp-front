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
  X, 
  Star, 
  Search, 
  Calendar,
  User
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Order {
  id: string
  tipoServico: string
  descricao: string
  status: 'aguardando' | 'em-andamento' | 'concluido' | 'cancelado'
  data: string
  prestador: string
  avaliacao?: number
}

export function OrdersTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  // Dados mockados - em produção viria da API
  const orders: Order[] = [
    {
      id: "PED-001",
      tipoServico: "Limpeza",
      descricao: "Limpeza residencial completa",
      status: "aguardando",
      data: "2024-01-15",
      prestador: "João Silva"
    },
    {
      id: "PED-002",
      tipoServico: "Manutenção",
      descricao: "Reparo no ar condicionado",
      status: "em-andamento",
      data: "2024-01-14",
      prestador: "Maria Santos"
    },
    {
      id: "PED-003",
      tipoServico: "Instalação",
      descricao: "Instalação de ventilador",
      status: "concluido",
      data: "2024-01-10",
      prestador: "Pedro Costa",
      avaliacao: 5
    },
    {
      id: "PED-004",
      tipoServico: "Consultoria",
      descricao: "Consultoria em organização",
      status: "cancelado",
      data: "2024-01-08",
      prestador: "Ana Oliveira"
    }
  ]

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      aguardando: { label: "Aguardando", variant: "secondary" as const },
      "em-andamento": { label: "Em Andamento", variant: "outline" as const },
      concluido: { label: "Concluído", variant: "default" as const },
      cancelado: { label: "Cancelado", variant: "destructive" as const }
    }
    
    const config = statusConfig[status]
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    )
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.prestador.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "todos" || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (orderId: string) => {
    console.log("Ver detalhes do pedido:", orderId)
    // Implementar modal ou navegação para detalhes
  }

  const handleCancelOrder = (orderId: string) => {
    console.log("Cancelar pedido:", orderId)
    // Implementar lógica de cancelamento
  }

  const handleRateOrder = (orderId: string) => {
    console.log("Avaliar pedido:", orderId)
    // Implementar modal de avaliação
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Pedidos Recentes
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="aguardando">Aguardando</SelectItem>
                <SelectItem value="em-andamento">Em Andamento</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
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
                <TableHead>Tipo de Serviço</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
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
                  <TableCell>{new Date(order.data).toLocaleDateString('pt-BR')}</TableCell>
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
                      
                      {order.status === 'aguardando' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelOrder(order.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum pedido encontrado com os filtros aplicados.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
