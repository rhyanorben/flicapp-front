import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period");
    const status = searchParams.get("status");
    const dateFromParam = searchParams.get("dateFrom");
    const dateToParam = searchParams.get("dateTo");

    // Build date filter based on period or custom date range
    let dateFilter: { gte?: Date; lte?: Date } | undefined = undefined;

    if (dateFromParam || dateToParam) {
      // Custom date range
      dateFilter = {};
      if (dateFromParam) {
        dateFilter.gte = new Date(dateFromParam);
      }
      if (dateToParam) {
        const toDate = new Date(dateToParam);
        // Set to end of day
        toDate.setHours(23, 59, 59, 999);
        dateFilter.lte = toDate;
      }
    } else if (period) {
      // Predefined period
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateFilter = { gte: startDate };
          break;
        case "30d":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          dateFilter = { gte: startDate };
          break;
        case "90d":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          dateFilter = { gte: startDate };
          break;
      }
    }

    // Build where clause
    const where: Prisma.OrderWhereInput = {
      clientId: session.user.id,
    };

    if (dateFilter) {
      where.createdAt = dateFilter;
    }

    if (status && status !== "all") {
      // Map status values to order statuses
      const statusMap: Record<string, string> = {
        pending: "matching",
        approved: "accepted",
        rejected: "cancelled",
      };
      const mappedStatus = statusMap[status] || status;
      where.status = mappedStatus;
    }

    // Get user's orders with relations
    const orders = await prisma.order.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderReview: {
          select: {
            rating: true,
            comment: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate statistics
    const totalOrders = orders.length;
    const inProgressOrders = orders.filter((order) =>
      [
        "matching",
        "await_cpf",
        "await_provider",
        "accepted",
        "in_progress",
      ].includes(order.status)
    ).length;
    const completedOrders = orders.filter(
      (order) => order.status === "completed"
    ).length;

    // Calculate pending reviews (completed orders without reviews)
    const pendingReviews = orders.filter(
      (order) => order.status === "completed" && !order.orderReview
    ).length;

    // Calculate monthly requests - use filtered orders
    const currentDate = new Date();
    const monthlyRequests: Record<string, number> = {};

    // Determine range based on filters or default to 6 months
    let monthsToShow = 6;
    let startDate = new Date();

    if (dateFilter?.gte) {
      startDate = dateFilter.gte;
      const monthsDiff =
        (currentDate.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24 * 30);
      monthsToShow = Math.min(Math.ceil(monthsDiff) + 1, 12);
    } else if (period === "7d") {
      monthsToShow = 1;
      startDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === "30d") {
      monthsToShow = 1;
      startDate = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (period === "90d") {
      monthsToShow = 3;
      startDate = new Date(currentDate.getTime() - 90 * 24 * 60 * 60 * 1000);
    }

    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthKey = date.toLocaleDateString("pt-BR", {
        month: "short",
        year: "2-digit",
      });
      monthlyRequests[monthKey] = 0;
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      if (orderDate >= startDate) {
        const monthKey = orderDate.toLocaleDateString("pt-BR", {
          month: "short",
          year: "2-digit",
        });
        if (monthlyRequests.hasOwnProperty(monthKey)) {
          monthlyRequests[monthKey]++;
        }
      }
    });

    // Calculate categories distribution
    const categoriesDistribution: Record<string, number> = {};
    orders.forEach((order) => {
      if (order.category) {
        const categoryName = order.category.name;
        categoriesDistribution[categoryName] =
          (categoriesDistribution[categoryName] || 0) + 1;
      }
    });

    // Get recent orders (last 5)
    const recentOrders = orders.slice(0, 5).map((order) => ({
      id: order.id,
      service: order.category?.name || "Não especificado",
      provider: order.provider?.name || "Não atribuído",
      status: mapOrderStatus(order.status),
      createdAt: order.createdAt,
    }));

    // Get favorite providers (most used providers)
    const providerStats: Record<
      string,
      { name: string; count: number; rating: number }
    > = {};
    orders.forEach((order) => {
      if (order.provider) {
        const providerId = order.provider.id;
        if (!providerStats[providerId]) {
          providerStats[providerId] = {
            name: order.provider.name,
            count: 0,
            rating: 0,
          };
        }
        providerStats[providerId].count++;

        // Calculate average rating for this provider
        const providerOrders = orders.filter(
          (o) => o.provider?.id === providerId && o.orderReview?.rating
        );
        if (providerOrders.length > 0) {
          const totalRating = providerOrders.reduce(
            (sum, o) => sum + (o.orderReview?.rating || 0),
            0
          );
          providerStats[providerId].rating =
            totalRating / providerOrders.length;
        }
      }
    });

    const favoriteProviders = Object.values(providerStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((provider) => ({
        name: provider.name,
        rating: Math.round(provider.rating * 10) / 10,
        services: provider.count,
      }));

    // Get upcoming schedules (orders with future slotStart)
    const now = new Date();
    const upcomingSchedules = orders
      .filter((order) => order.slotStart && new Date(order.slotStart) > now)
      .slice(0, 3)
      .map((order) => ({
        id: order.id,
        service: order.category?.name || "Não especificado",
        provider: order.provider?.name || "Não atribuído",
        time: order.slotStart
          ? new Date(order.slotStart).toLocaleString("pt-BR")
          : "Não agendado",
      }));

    // Generate tips based on user behavior
    const tips = generateTips(
      totalOrders,
      completedOrders,
      pendingReviews,
      favoriteProviders.length
    );

    const dashboardData = {
      services: {
        total: totalOrders,
        inProgress: inProgressOrders,
        completed: completedOrders,
        favorites: favoriteProviders.length,
      },
      monthlyRequests,
      categoriesDistribution,
      recentOrders,
      favoriteProviders,
      upcomingSchedules,
      pendingReviews,
      tips,
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching client dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function mapOrderStatus(
  status: string
): "IN_PROGRESS" | "COMPLETED" | "PENDING" {
  switch (status) {
    case "completed":
      return "COMPLETED";
    case "cancelled":
      return "PENDING"; // Treat cancelled as pending for display
    case "matching":
    case "await_cpf":
    case "await_provider":
    case "accepted":
    case "in_progress":
      return "IN_PROGRESS";
    default:
      return "PENDING";
  }
}

function generateTips(
  totalOrders: number,
  completedOrders: number,
  pendingReviews: number,
  favoriteProvidersCount: number
): string[] {
  const tips: string[] = [];

  if (pendingReviews > 0) {
    tips.push(
      `Você tem ${pendingReviews} serviço(s) aguardando avaliação. Avalie para ajudar outros clientes!`
    );
  }

  if (favoriteProvidersCount === 0 && totalOrders > 0) {
    tips.push(
      "Considere favoritar prestadores que você gostou para facilitar futuras contratações."
    );
  }

  if (completedOrders > 0) {
    tips.push(
      "Seus serviços concluídos mostram que você está aproveitando bem a plataforma!"
    );
  }

  if (totalOrders === 0) {
    tips.push(
      "Que tal solicitar seu primeiro serviço? Temos prestadores qualificados esperando por você!"
    );
  }

  if (totalOrders > 5) {
    tips.push(
      "Você é um cliente frequente! Que tal explorar novos tipos de serviços?"
    );
  }

  // Default tips if no specific ones
  if (tips.length === 0) {
    tips.push(
      "Dica: Sempre leia as avaliações dos prestadores antes de contratar.",
      "Dica: Seja específico na descrição do serviço para melhores resultados.",
      "Dica: Avalie os serviços para ajudar a comunidade FlicApp."
    );
  }

  return tips.slice(0, 3); // Return max 3 tips
}
