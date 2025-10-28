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

    // Get user's completed and cancelled orders
    const orders = await prisma.order.findMany({
      where: {
        clientId: session.user.id,
        status: { in: ["completed", "cancelled"] },
      },
      include: {
        orderReview: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Calculate stats
    const total = orders.length;
    const concluidos = orders.filter(
      (order) => order.status === "completed"
    ).length;
    const cancelados = orders.filter(
      (order) => order.status === "cancelled"
    ).length;

    // Calculate total spent (only completed orders with final price)
    const totalGasto =
      orders
        .filter(
          (order) => order.status === "completed" && order.finalPriceCents
        )
        .reduce((sum, order) => sum + (order.finalPriceCents || 0), 0) / 100;

    // Calculate average rating
    const ratings = orders
      .filter((order) => order.orderReview?.rating)
      .map((order) => order.orderReview!.rating!);

    const avaliacaoMedia =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0;

    const stats = {
      total,
      concluidos,
      cancelados,
      totalGasto: Math.round(totalGasto * 100) / 100, // Round to 2 decimal places
      avaliacaoMedia: Math.round(avaliacaoMedia * 10) / 10, // Round to 1 decimal place
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching history stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
