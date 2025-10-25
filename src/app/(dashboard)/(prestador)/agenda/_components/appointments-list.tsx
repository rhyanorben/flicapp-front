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
  Calendar,
  User,
  Clock,
  MapPin,
  MessageSquare
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Appointment {
  id: string
  cliente: string
  tipoServico: string
  descricao: string
  data: string
  horario: string
  localizacao: string
  status: 'agendado' | 'confirmado' | 'concluido' | 'cancelado'
  observacoes?: string
}

export function AppointmentsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [dateFilter, setDateFilter] = useState("todos")

  // Dados mockados - em produção viria da API
  const appointments: Appointment[] = [
    {
      id: "APT-001",
      cliente: "Ana Silva",
      tipoServico: "Limpeza",
      descricao: "Limpeza residencial completa",
      data: "2024-01-15",
      horario: "09:00",
      localizacao: "São Paulo, SP",
      status: "confirmado",
      observacoes: "Apartamento térreo, portão azul"
    },
    {
      id: "APT-002",
      cliente: "João Santos",
      tipoServico: "Manutenção",
      descricao: "Reparo no ar condicionado",
      data: "2024-01-15",
      horario: "14:00",
      localizacao: "São Paulo, SP",
      status: "agendado",
      observacoes: "AC não está gelando"
    },
    {
      id: "APT-003",
      cliente: "Maria Costa",
      tipoServico: "Instalação",
      descricao: "Instalação de ventilador",
      data: "2024-01-16",
      horario: "10:30",
      localizacao: "São Paulo, SP",
      status: "concluido",
      observacoes: "Ventilador de teto"
    },
    {
      id: "APT-004",
      cliente: "Pedro Oliveira",
      tipoServico: "Consultoria",
      descricao: "Consultoria em organização",
      data: "2024-01-18",
      horario: "16:00",
      localizacao: "São Paulo, SP",
      status: "cancelado",
      observacoes: "Cliente cancelou por motivos pessoais"
    },
    {
      id: "APT-005",
      cliente: "Carla Mendes",
      tipoServico: "Reparo",
      descricao: "Reparo de eletrodoméstico",
      data: "2024-01-20",
      horario: "08:00",
      localizacao: "São Paulo, SP",
      status: "agendado",
      observacoes: "Micro-ondas não está funcionando"
    },
    {
      id: "APT-006",
      cliente: "Roberto Lima",
      tipoServico: "Limpeza",
      descricao: "Limpeza pós-obra",
      data: "2024-01-22",
      horario: "13:30",
      localizacao: "São Paulo, SP",
      status: "agendado",
      observacoes: "Casa em reforma, muito pó"
    }
  ]

  const getStatusBadge = (status: Appointment['status']) => {
    const statusConfig = {
      agendado: { label: "Agendado", variant: "secondary" as const },
      confirmado: { label: "Confirmado", variant: "default" as const },
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

  const getDateFilter = (date: string) => {
    const appointmentDate = new Date(date)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const appointmentDateOnly = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate())
    
    const diffTime = appointmentDateOnly.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "hoje"
    if (diffDays === 1) return "amanha"
    if (diffDays > 1 && diffDays <= 7) return "proxima_semana"
    if (diffDays < 0) return "passado"
    return "futuro"
  }

  // Ordenar por data e horário
  const sortedAppointments = appointments.sort((a, b) => {
    const dateA = new Date(`${a.data}T${a.horario}`)
    const dateB = new Date(`${b.data}T${b.horario}`)
    return dateA.getTime() - dateB.getTime()
  })

  const filteredAppointments = sortedAppointments.filter(appointment => {
    const matchesSearch = appointment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.tipoServico.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "todos" || appointment.status === statusFilter
    const matchesDate = dateFilter === "todos" || getDateFilter(appointment.data) === dateFilter
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const handleViewDetails = (appointmentId: string) => {
    console.log("Ver detalhes do agendamento:", appointmentId)
    // Implementar modal ou navegação para detalhes
  }

  const handleConfirmAppointment = (appointmentId: string) => {
    console.log("Confirmar agendamento:", appointmentId)
    // Implementar lógica de confirmação
  }

  const handleCancelAppointment = (appointmentId: string) => {
    console.log("Cancelar agendamento:", appointmentId)
    // Implementar lógica de cancelamento
  }

  const handleContactClient = (appointmentId: string) => {
    console.log("Contatar cliente:", appointmentId)
    // Implementar modal de contato
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Lista de Agendamentos
        </CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todas as datas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as datas</SelectItem>
                <SelectItem value="hoje">Hoje</SelectItem>
                <SelectItem value="amanha">Amanhã</SelectItem>
                <SelectItem value="proxima_semana">Próxima semana</SelectItem>
                <SelectItem value="passado">Passado</SelectItem>
                <SelectItem value="futuro">Futuro</SelectItem>
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
                <TableHead>Data</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">{appointment.id}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {appointment.cliente}
                  </TableCell>
                  <TableCell>{appointment.tipoServico}</TableCell>
                  <TableCell className="max-w-xs truncate">{appointment.descricao}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(appointment.data).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {appointment.horario}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {appointment.localizacao}
                  </TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(appointment.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {appointment.status === 'agendado' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleConfirmAppointment(appointment.id)}
                            className="text-accent hover:text-accent/80"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      {(appointment.status === 'confirmado' || appointment.status === 'agendado') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContactClient(appointment.id)}
                          className="text-primary hover:text-primary/80"
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
        
        {filteredAppointments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum agendamento encontrado com os filtros aplicados.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
