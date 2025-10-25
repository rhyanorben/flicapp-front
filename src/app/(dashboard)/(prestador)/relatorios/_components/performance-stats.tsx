"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Star, 
  Clock, 
  CheckCircle, 
  Users,
  Award,
  Zap
} from "lucide-react"

export function PerformanceStats() {
  // Dados mockados - em produção viria da API
  const performanceData = {
    avaliacaoMedia: 4.7,
    totalAvaliacoes: 89,
    taxaConclusao: 94.2,
    tempoMedioResposta: 2.5,
    clientesRecorrentes: 23,
    servicosCancelados: 3
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Estatísticas de Desempenho</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">
              Avaliação Média
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {performanceData.avaliacaoMedia.toFixed(1)}
            </div>
            <div className="flex items-center gap-1 text-xs text-yellow-700">
              <Star className="h-3 w-3 fill-current" />
              <span>
                {performanceData.totalAvaliacoes} avaliações
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Taxa de Conclusão
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {performanceData.taxaConclusao}%
            </div>
            <p className="text-xs text-green-700">
              Serviços concluídos com sucesso
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Tempo Médio de Resposta
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {performanceData.tempoMedioResposta}h
            </div>
            <p className="text-xs text-blue-700">
              Para responder solicitações
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Clientes Recorrentes
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {performanceData.clientesRecorrentes}
            </div>
            <p className="text-xs text-purple-700">
              Clientes que voltaram a contratar
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">
              Eficiência
            </CardTitle>
            <Zap className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              92%
            </div>
            <p className="text-xs text-orange-700">
              Serviços no prazo
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">
              Cancelamentos
            </CardTitle>
            <Award className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {performanceData.servicosCancelados}
            </div>
            <p className="text-xs text-red-700">
              Serviços cancelados este mês
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
