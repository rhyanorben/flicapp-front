"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Target
} from "lucide-react"

export function FinancialStats() {
  const [period, setPeriod] = useState("mes")

  // Dados mockados - em produção viria da API
  const financialData = {
    mes: {
      totalGanhos: 2840.00,
      ganhosAnterior: 2650.00,
      servicosRealizados: 18,
      servicosAnterior: 15,
      ticketMedio: 157.78,
      ticketAnterior: 176.67
    },
    trimestre: {
      totalGanhos: 8520.00,
      ganhosAnterior: 7950.00,
      servicosRealizados: 54,
      servicosAnterior: 48,
      ticketMedio: 157.78,
      ticketAnterior: 165.63
    },
    ano: {
      totalGanhos: 34160.00,
      ganhosAnterior: 31800.00,
      servicosRealizados: 216,
      servicosAnterior: 192,
      ticketMedio: 158.15,
      ticketAnterior: 165.63
    }
  }

  const currentData = financialData[period as keyof typeof financialData]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getPercentageChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600"
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? TrendingUp : TrendingDown
  }

  const totalGanhosChange = getPercentageChange(currentData.totalGanhos, currentData.ganhosAnterior)
  const servicosChange = getPercentageChange(currentData.servicosRealizados, currentData.servicosAnterior)
  const ticketChange = getPercentageChange(currentData.ticketMedio, currentData.ticketAnterior)

  const TotalGanhosIcon = getChangeIcon(totalGanhosChange)
  const ServicosIcon = getChangeIcon(servicosChange)
  const TicketIcon = getChangeIcon(ticketChange)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Estatísticas Financeiras</h2>
        <div className="flex gap-2">
          <Button
            variant={period === "mes" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("mes")}
          >
            Este Mês
          </Button>
          <Button
            variant={period === "trimestre" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("trimestre")}
          >
            Este Trimestre
          </Button>
          <Button
            variant={period === "ano" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("ano")}
          >
            Este Ano
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Total de Ganhos
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(currentData.totalGanhos)}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <TotalGanhosIcon className={`h-3 w-3 ${getChangeColor(totalGanhosChange)}`} />
              <span className={getChangeColor(totalGanhosChange)}>
                {Math.abs(totalGanhosChange).toFixed(1)}%
              </span>
              <span className="text-green-700">
                vs período anterior
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Serviços Realizados
            </CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {currentData.servicosRealizados}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <ServicosIcon className={`h-3 w-3 ${getChangeColor(servicosChange)}`} />
              <span className={getChangeColor(servicosChange)}>
                {Math.abs(servicosChange).toFixed(1)}%
              </span>
              <span className="text-blue-700">
                vs período anterior
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Ticket Médio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(currentData.ticketMedio)}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <TicketIcon className={`h-3 w-3 ${getChangeColor(ticketChange)}`} />
              <span className={getChangeColor(ticketChange)}>
                {Math.abs(ticketChange).toFixed(1)}%
              </span>
              <span className="text-purple-700">
                vs período anterior
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
