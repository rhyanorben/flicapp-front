"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Users, TrendingUp, Award, MessageSquare } from "lucide-react";

export function RatingsOverview() {
  // Dados mockados - em produção viria da API
  const ratingsData = {
    mediaGeral: 4.7,
    totalAvaliacoes: 89,
    distribuicao: {
      5: 52,
      4: 28,
      3: 7,
      2: 2,
      1: 0,
    },
    comentarios: 67,
    avaliacoesRecentes: 12,
  };

  const getStarDisplay = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-yellow-800">
            Avaliação Média
          </CardTitle>
          <Star className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-900">
            {ratingsData.mediaGeral.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {getStarDisplay(ratingsData.mediaGeral)}
          </div>
          <p className="text-xs text-yellow-700 mt-2">
            {ratingsData.totalAvaliacoes} avaliações
          </p>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">
            Total de Avaliações
          </CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-900">
            {ratingsData.totalAvaliacoes}
          </div>
          <div className="flex items-center gap-1 text-xs text-blue-700">
            <TrendingUp className="h-3 w-3" />
            <span>+{ratingsData.avaliacoesRecentes} este mês</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">
            Comentários
          </CardTitle>
          <MessageSquare className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-900">
            {ratingsData.comentarios}
          </div>
          <p className="text-xs text-green-700">
            {Math.round(
              (ratingsData.comentarios / ratingsData.totalAvaliacoes) * 100
            )}
            % com comentários
          </p>
        </CardContent>
      </Card>

      <Card className="border-purple-200 bg-purple-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">
            Excelência
          </CardTitle>
          <Award className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-900">
            {Math.round(
              ((ratingsData.distribuicao[5] + ratingsData.distribuicao[4]) /
                ratingsData.totalAvaliacoes) *
                100
            )}
            %
          </div>
          <p className="text-xs text-purple-700">Avaliações 4+ estrelas</p>
        </CardContent>
      </Card>
    </div>
  );
}
