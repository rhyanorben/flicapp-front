"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, BarChart3 } from "lucide-react";

export function RatingsChart() {
  // Dados mockados - em produção viria da API
  const distributionData = [
    { stars: 5, count: 52, percentage: 58 },
    { stars: 4, count: 28, percentage: 31 },
    { stars: 3, count: 7, percentage: 8 },
    { stars: 2, count: 2, percentage: 2 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  const maxCount = Math.max(...distributionData.map((d) => d.count));

  const getStarDisplay = (count: number) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }
    return stars;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Distribuição das Avaliações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {distributionData.map((item) => (
            <div key={item.stars} className="flex items-center gap-4">
              <div className="flex items-center gap-1 min-w-[80px]">
                {getStarDisplay(item.stars)}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="bg-blue-500 h-4 rounded"
                    style={{
                      width: `${(item.count / maxCount) * 100}%`,
                      minWidth: item.count > 0 ? "8px" : "0px",
                    }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {item.count}
                  </span>
                </div>
              </div>

              <div className="min-w-[40px] text-right">
                <span className="text-sm text-gray-600">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">Resumo:</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">
                Avaliações positivas (4-5★):
              </span>
              <span className="font-medium ml-1">
                {distributionData[0].count + distributionData[1].count}(
                {distributionData[0].percentage +
                  distributionData[1].percentage}
                %)
              </span>
            </div>
            <div>
              <span className="text-gray-600">Avaliações neutras (3★):</span>
              <span className="font-medium ml-1">
                {distributionData[2].count} ({distributionData[2].percentage}%)
              </span>
            </div>
            <div>
              <span className="text-gray-600">
                Avaliações negativas (1-2★):
              </span>
              <span className="font-medium ml-1">
                {distributionData[3].count + distributionData[4].count}(
                {distributionData[3].percentage +
                  distributionData[4].percentage}
                %)
              </span>
            </div>
            <div>
              <span className="text-gray-600">Taxa de satisfação:</span>
              <span className="font-medium text-green-600 ml-1">
                {distributionData[0].percentage +
                  distributionData[1].percentage}
                %
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
