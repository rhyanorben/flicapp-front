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

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMINISTRADOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get users statistics
    const totalUsers = await prisma.user.count();
    const admins = await prisma.user.count({
      where: { role: "ADMINISTRADOR" },
    });
    const providers = await prisma.user.count({ where: { role: "PRESTADOR" } });
    const clients = await prisma.user.count({ where: { role: "CLIENTE" } });

    // Get users by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const usersByMonth = await prisma.user.groupBy({
      by: ["createdAt"],
      _count: { id: true },
      where: {
        createdAt: { gte: sixMonthsAgo },
      },
      orderBy: { createdAt: "asc" },
    });

    // Transform users by month data
    const monthlyUsers: { [month: string]: number } = {};
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
      monthlyUsers[monthKey] = 0;
    }

    usersByMonth.forEach((group) => {
      const date = new Date(group.createdAt);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      if (monthlyUsers.hasOwnProperty(monthKey)) {
        monthlyUsers[monthKey] += group._count.id;
      }
    });

    // Get provider requests statistics
    const totalRequests = await prisma.providerRequest.count();
    const pendingRequests = await prisma.providerRequest.count({
      where: { status: "PENDING" },
    });
    const approvedRequests = await prisma.providerRequest.count({
      where: { status: "APPROVED" },
    });
    const rejectedRequests = await prisma.providerRequest.count({
      where: { status: "REJECTED" },
    });

    // Get provider requests by month
    const requestsByMonth = await prisma.providerRequest.groupBy({
      by: ["createdAt"],
      _count: { id: true },
      where: {
        createdAt: { gte: sixMonthsAgo },
      },
      orderBy: { createdAt: "asc" },
    });

    // Transform requests by month data
    const monthlyRequests: { [month: string]: number } = {};
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthlyRequests[monthKey] = 0;
    }

    requestsByMonth.forEach((group) => {
      const date = new Date(group.createdAt);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      if (monthlyRequests.hasOwnProperty(monthKey)) {
        monthlyRequests[monthKey] += group._count.id;
      }
    });

    // Get recent provider requests
    const recentRequests = await prisma.providerRequest.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
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

    const data = {
      users: {
        total: totalUsers,
        admins,
        providers,
        clients,
        byMonth: monthlyUsers,
      },
      providerRequests: {
        total: totalRequests,
        pending: pendingRequests,
        approved: approvedRequests,
        rejected: rejectedRequests,
        byMonth: monthlyRequests,
        recent: recentRequests.map((request) => ({
          id: request.id,
          userId: request.userId,
          user: request.user,
          status: request.status,
          createdAt: request.createdAt.toISOString(),
        })),
      },
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
