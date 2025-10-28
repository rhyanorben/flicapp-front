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

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "mes"; // mes, trimestre, ano

    let startDate: Date;
    let endDate: Date = new Date();
    let previousStartDate: Date;
    let previousEndDate: Date;

    const now = new Date();

    switch (period) {
      case "mes":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        previousEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case "trimestre":
        const currentQuarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
        previousStartDate = new Date(
          now.getFullYear(),
          (currentQuarter - 1) * 3,
          1
        );
        previousEndDate = new Date(now.getFullYear(), currentQuarter * 3, 0);
        break;
      case "ano":
        startDate = new Date(now.getFullYear(), 0, 1);
        previousStartDate = new Date(now.getFullYear() - 1, 0, 1);
        previousEndDate = new Date(now.getFullYear() - 1, 11, 31);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        previousEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
    }

    // Get current period orders
    const currentOrders = await prisma.order.findMany({
      where: {
        providerId: session.user.id,
        status: "completed",
        updatedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        finalPriceCents: true,
        updatedAt: true,
      },
    });

    // Get previous period orders
    const previousOrders = await prisma.order.findMany({
      where: {
        providerId: session.user.id,
        status: "completed",
        updatedAt: {
          gte: previousStartDate,
          lte: previousEndDate,
        },
      },
      select: {
        finalPriceCents: true,
        updatedAt: true,
      },
    });

    // Calculate current period stats
    const totalGanhos =
      currentOrders.reduce(
        (sum, order) => sum + (order.finalPriceCents || 0),
        0
      ) / 100;
    const servicosRealizados = currentOrders.length;
    const ticketMedio =
      servicosRealizados > 0 ? totalGanhos / servicosRealizados : 0;

    // Calculate previous period stats
    const ganhosAnterior =
      previousOrders.reduce(
        (sum, order) => sum + (order.finalPriceCents || 0),
        0
      ) / 100;
    const servicosAnterior = previousOrders.length;
    const ticketAnterior =
      servicosAnterior > 0 ? ganhosAnterior / servicosAnterior : 0;

    // Calculate percentage changes
    const getPercentageChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100 * 100) / 100;
    };

    const totalGanhosChange = getPercentageChange(totalGanhos, ganhosAnterior);
    const servicosChange = getPercentageChange(
      servicosRealizados,
      servicosAnterior
    );
    const ticketChange = getPercentageChange(ticketMedio, ticketAnterior);

    const financialData = {
      totalGanhos: Math.round(totalGanhos * 100) / 100,
      ganhosAnterior: Math.round(ganhosAnterior * 100) / 100,
      servicosRealizados,
      servicosAnterior,
      ticketMedio: Math.round(ticketMedio * 100) / 100,
      ticketAnterior: Math.round(ticketAnterior * 100) / 100,
      totalGanhosChange,
      servicosChange,
      ticketChange,
    };

    return NextResponse.json(financialData);
  } catch (error) {
    console.error("Error fetching financial data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
