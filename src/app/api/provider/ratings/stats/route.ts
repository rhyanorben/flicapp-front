import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all ratings for this provider
    const ratings = await prisma.orderReview.findMany({
      where: {
        providerId: session.user.id,
      },
      select: {
        rating: true,
        comment: true,
        createdAt: true,
      },
    });

    // Calculate statistics
    const totalAvaliacoes = ratings.length;
    const avaliacoesComComentarios = ratings.filter(
      (r) => r.comment && r.comment.trim().length > 0
    ).length;

    // Calculate average rating
    const avaliacaoMedia =
      totalAvaliacoes > 0
        ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / totalAvaliacoes
        : 0;

    // Calculate distribution
    const distribuicao = {
      5: ratings.filter((r) => r.rating === 5).length,
      4: ratings.filter((r) => r.rating === 4).length,
      3: ratings.filter((r) => r.rating === 3).length,
      2: ratings.filter((r) => r.rating === 2).length,
      1: ratings.filter((r) => r.rating === 1).length,
    };

    // Calculate recent ratings (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const avaliacoesRecentes = ratings.filter(
      (r) => r.createdAt && new Date(r.createdAt) >= thirtyDaysAgo
    ).length;

    // Calculate positive ratings (4-5 stars)
    const avaliacoesPositivas = distribuicao[5] + distribuicao[4];
    const taxaSatisfacao =
      totalAvaliacoes > 0
        ? Math.round((avaliacoesPositivas / totalAvaliacoes) * 100)
        : 0;

    // Calculate excellence rate (4+ stars)
    const taxaExcelencia =
      totalAvaliacoes > 0
        ? Math.round((avaliacoesPositivas / totalAvaliacoes) * 100)
        : 0;

    const stats = {
      mediaGeral: Math.round(avaliacaoMedia * 10) / 10, // Round to 1 decimal place
      totalAvaliacoes,
      distribuicao,
      comentarios: avaliacoesComComentarios,
      avaliacoesRecentes,
      taxaSatisfacao,
      taxaExcelencia,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching provider rating stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
