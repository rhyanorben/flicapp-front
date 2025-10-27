import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";
import { getUserRoles } from "@/lib/role-utils";

const prisma = new PrismaClient();

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

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const usersLastSixMonths = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const usersByMonth = usersLastSixMonths.reduce((acc: Record<string, number>, user) => {
      const month = new Date(user.createdAt).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "short",
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const requestsLastSixMonths = await prisma.providerRequest.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        createdAt: true,
        status: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const requestsByMonth = requestsLastSixMonths.reduce(
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
        recent: recentRequests,
      },
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}
