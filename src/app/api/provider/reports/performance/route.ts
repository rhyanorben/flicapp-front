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

    // Get all orders for this provider
    const orders = await prisma.order.findMany({
      where: {
        providerId: session.user.id,
      },
      include: {
        orderReview: {
          select: {
            rating: true,
            comment: true,
          },
        },
      },
    });

    // Calculate rating statistics
    const ratings = orders
      .filter((order) => order.orderReview?.rating)
      .map((order) => order.orderReview!.rating!);

    const avaliacaoMedia =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0;

    const totalAvaliacoes = ratings.length;

    // Calculate completion rate
    const totalOrders = orders.length;
    const completedOrders = orders.filter(
      (order) => order.status === "completed"
    ).length;
    const cancelledOrders = orders.filter(
      (order) => order.status === "cancelled"
    ).length;
    const taxaConclusao =
      totalOrders > 0
        ? Math.round((completedOrders / totalOrders) * 100 * 10) / 10
        : 0;

    // Calculate response time (mock data for now - would need actual response tracking)
    const tempoMedioResposta = 2.5; // hours

    // Calculate recurring clients
    const clientIds = orders.map((order) => order.clientId);
    const uniqueClients = new Set(clientIds);
    const clientesRecorrentes = Array.from(uniqueClients).filter(
      (clientId) => clientIds.filter((id) => id === clientId).length > 1
    ).length;

    // Calculate efficiency (completed vs total)
    const eficiencia =
      totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

    // Calculate deltas (vs previous month - mock data for now)
    const deltas = {
      avaliacaoMedia: 1.2,
      taxaConclusao: 0.8,
      tempoMedioResposta: -8.3,
      clientesRecorrentes: 6.7,
      eficiencia: 2.1,
      servicosCancelados: -12.5,
    };

    const performanceData = {
      avaliacaoMedia: Math.round(avaliacaoMedia * 10) / 10,
      totalAvaliacoes,
      taxaConclusao,
      tempoMedioResposta,
      clientesRecorrentes,
      servicosCancelados: cancelledOrders,
      eficiencia,
      deltas,
    };

    return NextResponse.json(performanceData);
  } catch (error) {
    console.error("Error fetching performance data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
