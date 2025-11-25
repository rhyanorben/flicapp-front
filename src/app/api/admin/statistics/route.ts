import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserRoles } from "@/lib/role-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const userId = session.user.id;

    const userRoles = await getUserRoles(userId);
    const isAdmin = userRoles.includes("ADMINISTRADOR");

    if (!isAdmin) {
      return NextResponse.json(
        {
          error:
            "Acesso negado. Apenas administradores podem visualizar estatísticas.",
        },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";
    const status = searchParams.get("status") || "all";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Calculate date range based on filters
    let startDate: Date;
    let endDate: Date = new Date();

    if (dateFrom && dateTo) {
      startDate = new Date(dateFrom);
      endDate = new Date(dateTo);
    } else {
      // Default to period-based filtering
      switch (period) {
        case "7d":
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "90d":
          startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 6);
          break;
        case "30d":
        default:
          startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 6);
          break;
      }
    }

    const totalUsers = await prisma.user.count();

    const adminRole = await prisma.role.findUnique({
      where: { name: "ADMINISTRADOR" },
    });
    const providerRole = await prisma.role.findUnique({
      where: { name: "PRESTADOR" },
    });
    const clientRole = await prisma.role.findUnique({
      where: { name: "CLIENTE" },
    });

    const totalAdmins = adminRole
      ? await prisma.userRoleAssignment.count({
          where: { roleId: adminRole.id },
        })
      : 0;
    const totalProviders = providerRole
      ? await prisma.userRoleAssignment.count({
          where: { roleId: providerRole.id },
        })
      : 0;
    const totalClients = clientRole
      ? await prisma.userRoleAssignment.count({
          where: { roleId: clientRole.id },
        })
      : 0;

    const totalProviderRequests = await prisma.providerRequest.count();
    const pendingRequests = await prisma.providerRequest.count({
      where: { status: "PENDING" },
    });
    const approvedRequests = await prisma.providerRequest.count({
      where: { status: "APPROVED" },
    });
    const rejectedRequests = await prisma.providerRequest.count({
      where: { status: "REJECTED" },
    });

    const usersInPeriod = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const usersByMonth = usersInPeriod.reduce(
      (acc: Record<string, number>, user) => {
        const month = new Date(user.createdAt).toLocaleDateString("pt-BR", {
          year: "numeric",
          month: "short",
        });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      },
      {}
    );

    // Build provider requests filter
    const requestsFilter: {
      createdAt: {
        gte: Date;
        lte: Date;
      };
      status?: "PENDING" | "APPROVED" | "REJECTED";
    } = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    // Add status filter if specified
    if (status !== "all") {
      requestsFilter.status = status.toUpperCase() as
        | "PENDING"
        | "APPROVED"
        | "REJECTED";
    }

    const requestsInPeriod = await prisma.providerRequest.findMany({
      where: requestsFilter,
      select: {
        createdAt: true,
        status: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const requestsByMonth = requestsInPeriod.reduce(
      (acc: Record<string, number>, request) => {
        const month = new Date(request.createdAt).toLocaleDateString("pt-BR", {
          year: "numeric",
          month: "short",
        });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      },
      {}
    );

    // Calculate requests by status per month
    const requestsByStatusAndMonth = requestsInPeriod.reduce(
      (
        acc: Record<
          string,
          { pending: number; approved: number; rejected: number }
        >,
        request
      ) => {
        const month = new Date(request.createdAt).toLocaleDateString("pt-BR", {
          year: "numeric",
          month: "short",
        });

        if (!acc[month]) {
          acc[month] = { pending: 0, approved: 0, rejected: 0 };
        }

        if (request.status === "PENDING") {
          acc[month].pending += 1;
        } else if (request.status === "APPROVED") {
          acc[month].approved += 1;
        } else if (request.status === "REJECTED") {
          acc[month].rejected += 1;
        }

        return acc;
      },
      {}
    );

    const recentRequests = await prisma.providerRequest.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Get recent activities (last 20 activities) within the filtered period
    const recentActivities = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Get recent provider request activities within the filtered period
    const recentRequestActivities = await prisma.providerRequest.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Combine and format activities
    const activities = [
      ...recentActivities.map((user) => ({
        id: `user-${user.id}`,
        type: "user_registered" as const,
        title: "Novo usuário cadastrado",
        description: `${user.name} se cadastrou no sistema`,
        timestamp: user.createdAt.toISOString(),
        user: user.name,
      })),
      ...recentRequestActivities.map((request) => ({
        id: `request-${request.id}`,
        type:
          request.status === "PENDING"
            ? ("request_pending" as const)
            : request.status === "APPROVED"
            ? ("request_approved" as const)
            : ("request_rejected" as const),
        title:
          request.status === "PENDING"
            ? "Nova solicitação"
            : request.status === "APPROVED"
            ? "Solicitação aprovada"
            : "Solicitação rejeitada",
        description:
          request.status === "PENDING"
            ? `${request.user.name} solicitou tornar-se prestador`
            : request.status === "APPROVED"
            ? `${request.user.name} foi aprovado como prestador`
            : `${request.user.name} teve sua solicitação rejeitada`,
        timestamp: request.createdAt.toISOString(),
        user: request.user.name,
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 20);

    return NextResponse.json({
      users: {
        total: totalUsers,
        admins: totalAdmins,
        providers: totalProviders,
        clients: totalClients,
        byMonth: usersByMonth,
      },
      providerRequests: {
        total: totalProviderRequests,
        pending: pendingRequests,
        approved: approvedRequests,
        rejected: rejectedRequests,
        byMonth: requestsByMonth,
        byStatusAndMonth: requestsByStatusAndMonth,
        recent: recentRequests,
      },
      activities: activities,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}
