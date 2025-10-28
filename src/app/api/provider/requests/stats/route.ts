import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Helper function to calculate percentage delta
const calculateDelta = (previous: number, current: number): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
};

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current month's stats
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);

    // Get orders for this provider (assigned or available for matching)
    const currentMonthOrders = await prisma.order.findMany({
      where: {
        OR: [
          { providerId: session.user.id },
          {
            AND: [{ status: "matching" }, { providerId: null }],
          },
        ],
        createdAt: { gte: currentMonthStart },
      },
    });

    // Get previous month's stats
    const previousMonthStart = new Date(currentMonthStart);
    previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
    const previousMonthEnd = new Date(currentMonthStart);
    previousMonthEnd.setDate(0); // Last day of previous month

    const previousMonthOrders = await prisma.order.findMany({
      where: {
        OR: [
          { providerId: session.user.id },
          {
            AND: [{ status: "matching" }, { providerId: null }],
          },
        ],
        createdAt: { gte: previousMonthStart, lt: currentMonthStart },
      },
    });

    // Map status to display categories
    const mapStatusToCategory = (
      status: string,
      providerId: string | null
    ): string => {
      if (providerId === session.user.id) {
        switch (status) {
          case "accepted":
          case "in_progress":
          case "completed":
            return "aceitas";
          case "cancelled":
            return "recusadas";
          default:
            return "pendentes";
        }
      } else {
        // Orders available for matching
        if (status === "matching") {
          return "pendentes";
        }
        return "expiradas";
      }
    };

    // Calculate current stats
    const currentStats = {
      pendentes: 0,
      aceitas: 0,
      recusadas: 0,
      expiradas: 0,
      totalGanhos: 0,
    };

    currentMonthOrders.forEach((order) => {
      const category = mapStatusToCategory(order.status, order.providerId);
      currentStats[category as keyof typeof currentStats]++;

      if (category === "aceitas" && order.finalPriceCents) {
        currentStats.totalGanhos += order.finalPriceCents / 100;
      }
    });

    // Calculate previous stats
    const previousStats = {
      pendentes: 0,
      aceitas: 0,
      recusadas: 0,
      expiradas: 0,
      totalGanhos: 0,
    };

    previousMonthOrders.forEach((order) => {
      const category = mapStatusToCategory(order.status, order.providerId);
      previousStats[category as keyof typeof previousStats]++;

      if (category === "aceitas" && order.finalPriceCents) {
        previousStats.totalGanhos += order.finalPriceCents / 100;
      }
    });

    // Calculate deltas (percentage change)
    const deltas = {
      pendentes: calculateDelta(
        previousStats.pendentes,
        currentStats.pendentes
      ),
      aceitas: calculateDelta(previousStats.aceitas, currentStats.aceitas),
      recusadas: calculateDelta(
        previousStats.recusadas,
        currentStats.recusadas
      ),
      expiradas: calculateDelta(
        previousStats.expiradas,
        currentStats.expiradas
      ),
      totalGanhos: calculateDelta(
        previousStats.totalGanhos,
        currentStats.totalGanhos
      ),
    };

    return NextResponse.json({
      stats: currentStats,
      deltas,
    });
  } catch (error) {
    console.error("Error fetching provider request stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
