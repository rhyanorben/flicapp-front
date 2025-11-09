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
    const chartType = searchParams.get("type") || "ganhos"; // ganhos, servicos, tipos

    // Get orders from last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const orders = await prisma.order.findMany({
      where: {
        providerId: session.user.id,
        status: "completed",
        updatedAt: {
          gte: sixMonthsAgo,
        },
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (chartType === "ganhos") {
      // Calculate monthly earnings
      const monthlyEarnings: Record<string, number> = {};

      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toLocaleDateString("pt-BR", { month: "short" });
        monthlyEarnings[monthKey] = 0;
      }

      orders.forEach((order) => {
        if (order.finalPriceCents) {
          const orderDate = new Date(order.updatedAt);
          const monthKey = orderDate.toLocaleDateString("pt-BR", {
            month: "short",
          });
          if (monthlyEarnings.hasOwnProperty(monthKey)) {
            monthlyEarnings[monthKey] += order.finalPriceCents / 100;
          }
        }
      });

      const ganhosData = Object.entries(monthlyEarnings).map(
        ([mes, valor]) => ({
          mes,
          valor: Math.round(valor * 100) / 100,
        })
      );

      return NextResponse.json({ type: "ganhos", data: ganhosData });
    }

    if (chartType === "servicos") {
      // Calculate monthly services
      const monthlyServices: Record<string, number> = {};

      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toLocaleDateString("pt-BR", { month: "short" });
        monthlyServices[monthKey] = 0;
      }

      orders.forEach((order) => {
        const orderDate = new Date(order.updatedAt);
        const monthKey = orderDate.toLocaleDateString("pt-BR", {
          month: "short",
        });
        if (monthlyServices.hasOwnProperty(monthKey)) {
          monthlyServices[monthKey] += 1;
        }
      });

      const servicosData = Object.entries(monthlyServices).map(
        ([mes, quantidade]) => ({
          mes,
          quantidade,
        })
      );

      return NextResponse.json({ type: "servicos", data: servicosData });
    }

    if (chartType === "tipos") {
      // Calculate service type distribution
      const serviceTypes: Record<string, number> = {};

      orders.forEach((order) => {
        const serviceType = order.category?.name || "Outros";
        serviceTypes[serviceType] = (serviceTypes[serviceType] || 0) + 1;
      });

      const total = Object.values(serviceTypes).reduce(
        (sum, count) => sum + count,
        0
      );

      const tiposServicoData = Object.entries(serviceTypes)
        .map(([tipo, quantidade]) => ({
          tipo,
          quantidade,
          porcentagem: Math.round((quantidade / total) * 100),
        }))
        .sort((a, b) => b.quantidade - a.quantidade);

      return NextResponse.json({ type: "tipos", data: tiposServicoData });
    }

    return NextResponse.json({ error: "Invalid chart type" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
