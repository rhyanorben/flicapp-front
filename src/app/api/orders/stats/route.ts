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

    // Get current month and previous month dates
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Current month stats
    const currentStats = await prisma.order.groupBy({
      by: ["status"],
      where: {
        clientId: session.user.id,
        createdAt: {
          gte: currentMonthStart,
        },
      },
      _count: {
        id: true,
      },
    });

    // Previous month stats
    const previousStats = await prisma.order.groupBy({
      by: ["status"],
      where: {
        clientId: session.user.id,
        createdAt: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
      _count: {
        id: true,
      },
    });

    // Convert to objects for easier access
    const currentStatsMap = currentStats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.id;
      return acc;
    }, {} as Record<string, number>);

    const previousStatsMap = previousStats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.id;
      return acc;
    }, {} as Record<string, number>);

    // Calculate totals
    const currentTotal = Object.values(currentStatsMap).reduce(
      (sum, count) => sum + count,
      0
    );
    const previousTotal = Object.values(previousStatsMap).reduce(
      (sum, count) => sum + count,
      0
    );

    // Map status names to Portuguese
    const statusMap: Record<string, string> = {
      matching: "aguardando",
      await_cpf: "aguardando",
      await_provider: "aguardando",
      accepted: "emAndamento",
      in_progress: "emAndamento",
      completed: "concluidos",
      cancelled: "cancelados",
    };

    // Build stats object
    const stats = {
      total: currentTotal,
      aguardando: 0,
      emAndamento: 0,
      concluidos: 0,
      cancelados: 0,
    };

    const previousStatsObj = {
      total: previousTotal,
      aguardando: 0,
      emAndamento: 0,
      concluidos: 0,
      cancelados: 0,
    };

    // Map current stats
    Object.entries(currentStatsMap).forEach(([status, count]) => {
      const mappedStatus = statusMap[status] || "aguardando";
      if (mappedStatus in stats) {
        (stats as any)[mappedStatus] = count;
      }
    });

    // Map previous stats
    Object.entries(previousStatsMap).forEach(([status, count]) => {
      const mappedStatus = statusMap[status] || "aguardando";
      if (mappedStatus in previousStatsObj) {
        (previousStatsObj as any)[mappedStatus] = count;
      }
    });

    // Calculate deltas (percentage change)
    const deltas = {
      total: calculateDelta(previousStatsObj.total, stats.total),
      aguardando: calculateDelta(previousStatsObj.aguardando, stats.aguardando),
      emAndamento: calculateDelta(
        previousStatsObj.emAndamento,
        stats.emAndamento
      ),
      concluidos: calculateDelta(previousStatsObj.concluidos, stats.concluidos),
      cancelados: calculateDelta(previousStatsObj.cancelados, stats.cancelados),
    };

    return NextResponse.json({ stats, deltas });
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function calculateDelta(previous: number, current: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 100 * 10) / 10;
}
