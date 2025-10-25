"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Calendar, DollarSign } from "lucide-react";

export function ReportsCharts() {
  const [activeChart, setActiveChart] = useState("ganhos");

  // Dados mockados para os gráficos
  const ganhosData = [
    { mes: "Jan", valor: 2100 },
    { mes: "Fev", valor: 2400 },
    { mes: "Mar", valor: 2200 },
    { mes: "Abr", valor: 2800 },
    { mes: "Mai", valor: 2600 },
    { mes: "Jun", valor: 2840 },
  ];

  const servicosData = [
    { mes: "Jan", quantidade: 12 },
    { mes: "Fev", quantidade: 15 },
    { mes: "Mar", quantidade: 13 },
    { mes: "Abr", quantidade: 18 },
    { mes: "Mai", quantidade: 16 },
    { mes: "Jun", quantidade: 18 },
  ];

  const tiposServicoData = [
    { tipo: "Limpeza", quantidade: 45, porcentagem: 35 },
    { tipo: "Manutenção", quantidade: 32, porcentagem: 25 },
    { tipo: "Instalação", quantidade: 28, porcentagem: 22 },
    { tipo: "Consultoria", quantidade: 15, porcentagem: 12 },
    { tipo: "Reparo", quantidade: 8, porcentagem: 6 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const maxGanhos = Math.max(...ganhosData.map((d) => d.valor));
  const maxServicos = Math.max(...servicosData.map((d) => d.quantidade));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gráficos e Análises</h2>
        <div className="flex gap-2">
          <Button
            variant={activeChart === "ganhos" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveChart("ganhos")}
          >
            <DollarSign className="h-4 w-4 mr-1" />
            Ganhos
          </Button>
          <Button
            variant={activeChart === "servicos" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveChart("servicos")}
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Serviços
          </Button>
          <Button
            variant={activeChart === "tipos" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveChart("tipos")}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Tipos
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {activeChart === "ganhos" && (
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Evolução dos Ganhos (Últimos 6 meses)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ganhosData.map((item, index) => (
                  <div key={item.mes} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium text-gray-600">
                      {item.mes}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="bg-blue-500 h-6 rounded"
                          style={{
                            width: `${(item.valor / maxGanhos) * 100}%`,
                            minWidth: "20px",
                          }}
                        ></div>
                        <span className="text-sm font-medium">
                          {formatCurrency(item.valor)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeChart === "servicos" && (
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Quantidade de Serviços (Últimos 6 meses)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {servicosData.map((item, index) => (
                  <div key={item.mes} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium text-gray-600">
                      {item.mes}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="bg-green-500 h-6 rounded"
                          style={{
                            width: `${(item.quantidade / maxServicos) * 100}%`,
                            minWidth: "20px",
                          }}
                        ></div>
                        <span className="text-sm font-medium">
                          {item.quantidade} serviços
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeChart === "tipos" && (
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Distribuição por Tipo de Serviço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tiposServicoData.map((item, index) => (
                  <div key={item.tipo} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium text-gray-600">
                      {item.tipo}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="bg-purple-500 h-6 rounded"
                          style={{
                            width: `${item.porcentagem}%`,
                            minWidth: "20px",
                          }}
                        ></div>
                        <span className="text-sm font-medium">
                          {item.quantidade} ({item.porcentagem}%)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo do Período</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Melhor Mês:</span>
              <span className="font-medium">Junho - R$ 2.840,00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Média Mensal:</span>
              <span className="font-medium">R$ 2.490,00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Crescimento:</span>
              <span className="font-medium text-green-600">+7,2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Meta do Mês:</span>
              <span className="font-medium">R$ 2.500,00</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Próximas Metas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Meta Julho:</span>
              <span className="font-medium">R$ 3.000,00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Progresso:</span>
              <span className="font-medium">68%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Faltam:</span>
              <span className="font-medium">R$ 960,00</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: "68%" }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
