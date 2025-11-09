import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const providerId = session.user.id;

    // Get orders statistics for this provider
    const totalOrders = await prisma.order.count({
      where: { providerId },
    });

    const pendingOrders = await prisma.order.count({
      where: { providerId, status: "matching" },
    });

    const acceptedOrders = await prisma.order.count({
      where: { providerId, status: "accepted" },
    });

    const completedOrders = await prisma.order.count({
      where: { providerId, status: "completed" },
    });

    const rejectedOrders = await prisma.order.count({
      where: { providerId, status: "cancelled" },
    });

    // Get rating statistics
    const ratingStats = await prisma.orderReview.aggregate({
      _avg: { rating: true },
      _count: { rating: true },
      where: {
        order: { providerId, status: "completed" },
      },
    });

    const averageRating = ratingStats._avg.rating || 0;
    const totalReviews = ratingStats._count.rating || 0;

    // Calculate acceptance rate
    const acceptanceRate =
      totalOrders > 0 ? Math.round((acceptedOrders / totalOrders) * 100) : 0;

    // Get monthly trend for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const ordersByMonth = await prisma.order.groupBy({
      by: ["createdAt"],
      _count: { id: true },
      where: {
        providerId,
        createdAt: { gte: sixMonthsAgo },
      },
      orderBy: { createdAt: "asc" },
    });

    // Transform monthly data
    const monthlyTrend: { [month: string]: number } = {};
    const monthNames = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthlyTrend[monthKey] = 0;
    }

    ordersByMonth.forEach((group) => {
      const date = new Date(group.createdAt);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      if (monthlyTrend.hasOwnProperty(monthKey)) {
        monthlyTrend[monthKey] += group._count.id;
      }
    });

    // Get upcoming schedules (accepted orders with future dates)
    const upcomingSchedules = await prisma.order.findMany({
      where: {
        providerId,
        status: "accepted",
        slotStart: { gte: new Date() },
      },
      take: 5,
      orderBy: { slotStart: "asc" },
      include: {
        client: { select: { name: true } },
        category: { select: { name: true } },
        address: true,
      },
    });

    // Get recent requests (orders assigned to this provider)
    const recentRequests = await prisma.order.findMany({
      where: { providerId },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        client: { select: { name: true, email: true } },
        category: { select: { name: true } },
      },
    });

    // Get recent reviews
    const recentReviews = await prisma.orderReview.findMany({
      where: {
        order: { providerId, status: "completed" },
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        order: {
          select: {
            client: { select: { name: true } },
          },
        },
      },
    });

    // Calculate monthly goals (mock data for now)
    const monthlyGoals = {
      services: {
        target: 20,
        current: completedOrders,
        percentage: Math.round((completedOrders / 20) * 100),
      },
      rating: {
        target: 4.5,
        current: averageRating,
        percentage: Math.round((averageRating / 4.5) * 100),
      },
      completion: {
        target: 90,
        current: acceptanceRate,
        percentage: acceptanceRate,
      },
    };

    const data = {
      requests: {
        total: totalOrders,
        pending: pendingOrders,
        accepted: acceptedOrders,
        completed: completedOrders,
        rejected: rejectedOrders,
      },
      rating: Math.round(averageRating * 10) / 10,
      totalReviews,
      acceptanceRate,
      monthlyTrend,
      statusDistribution: {
        pending: pendingOrders,
        accepted: acceptedOrders,
        completed: completedOrders,
        cancelled: rejectedOrders,
      },
      upcomingSchedules: upcomingSchedules.map((schedule) => ({
        id: schedule.id,
        client: schedule.client?.name || "Não informado",
        service: schedule.category?.name || "Não especificado",
        date: schedule.slotStart
          ? new Date(schedule.slotStart).toLocaleDateString("pt-BR")
          : "Não agendado",
        time: schedule.slotStart
          ? new Date(schedule.slotStart).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Não agendado",
        address: schedule.address
          ? `${schedule.address.street}, ${schedule.address.number}, ${schedule.address.neighborhood}, ${schedule.address.city} - ${schedule.address.state}`
          : "Não informado",
      })),
      recentRequests: recentRequests.map((request) => ({
        id: request.id,
        client: {
          name: request.client?.name || "Não informado",
          email: request.client?.email || "Não informado",
        },
        service: request.category?.name || "Não especificado",
        status: request.status,
        createdAt: request.createdAt.toISOString(),
        description: request.description || "Sem descrição",
      })),
      recentReviews: recentReviews.map((review, index) => ({
        id: review.orderId || `review-${index}`,
        client: review.order.client?.name || "Não informado",
        rating: review.rating || 0,
        comment: review.comment || "Sem comentário",
        date: review.createdAt?.toISOString() || new Date().toISOString(),
      })),
      monthlyGoals,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching provider dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
