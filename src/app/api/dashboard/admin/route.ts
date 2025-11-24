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

    // Get query parameters
    const { searchParams } = new URL(req.url);
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

    // Build base where clause for users
    const userDateWhere: any = {};
    if (dateFilter) {
      userDateWhere.createdAt = dateFilter;
    }

    // Build base where clause for provider requests
    const requestWhere: any = {};
    if (dateFilter) {
      requestWhere.createdAt = dateFilter;
    }

    if (status && status !== "all") {
      const statusMap: Record<string, string> = {
        pending: "PENDING",
        approved: "APPROVED",
        rejected: "REJECTED",
      };
      requestWhere.status = statusMap[status] || status.toUpperCase();
    }

    // Get users statistics
    const totalUsers = await prisma.user.count({
      where: userDateWhere,
    });
    const admins = await prisma.user.count({
      where: { ...userDateWhere, role: "ADMINISTRADOR" },
    });
    const providers = await prisma.user.count({ 
      where: { ...userDateWhere, role: "PRESTADOR" } 
    });
    const clients = await prisma.user.count({ 
      where: { ...userDateWhere, role: "CLIENTE" } 
    });

    // Get users by month - use filtered date range
    const currentDate = new Date();
    let monthsToShow = 6;
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    if (dateFilter?.gte) {
      startDate = dateFilter.gte;
      const monthsDiff = (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
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

    const usersByMonth = await prisma.user.groupBy({
      by: ["createdAt"],
      _count: { id: true },
      where: {
        createdAt: { gte: startDate },
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

    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
      monthlyUsers[monthKey] = 0;
    }

    usersByMonth.forEach((group) => {
      const date = new Date(group.createdAt);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
      if (monthlyUsers.hasOwnProperty(monthKey)) {
        monthlyUsers[monthKey] += group._count.id;
      }
    });

    // Get provider requests statistics
    const totalRequests = await prisma.providerRequest.count({
      where: requestWhere,
    });
    const pendingRequests = await prisma.providerRequest.count({
      where: { ...requestWhere, status: "PENDING" },
    });
    const approvedRequests = await prisma.providerRequest.count({
      where: { ...requestWhere, status: "APPROVED" },
    });
    const rejectedRequests = await prisma.providerRequest.count({
      where: { ...requestWhere, status: "REJECTED" },
    });

    // Get provider requests by month
    const requestsByMonth = await prisma.providerRequest.groupBy({
      by: ["createdAt"],
      _count: { id: true },
      where: {
        ...requestWhere,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: "asc" },
    });

    // Transform requests by month data
    const monthlyRequests: { [month: string]: number } = {};
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
      monthlyRequests[monthKey] = 0;
    }

    requestsByMonth.forEach((group) => {
      const date = new Date(group.createdAt);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
      if (monthlyRequests.hasOwnProperty(monthKey)) {
        monthlyRequests[monthKey] += group._count.id;
      }
    });

    // Get recent provider requests
    const recentRequests = await prisma.providerRequest.findMany({
      where: requestWhere,
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
