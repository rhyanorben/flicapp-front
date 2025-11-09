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

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "todos"; // e.g., "7dias", "30dias", "90dias", "mais90dias"
    const status = searchParams.get("status") || "todos"; // e.g., "todos", "agendado", "confirmado", "concluido", "cancelado"

    let dateFilter: Date | undefined;
    const now = new Date();

    switch (period) {
      case "7dias":
        dateFilter = new Date(now.setDate(now.getDate() - 7));
        break;
      case "30dias":
        dateFilter = new Date(now.setDate(now.getDate() - 30));
        break;
      case "90dias":
        dateFilter = new Date(now.setDate(now.getDate() - 90));
        break;
      case "mais90dias":
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        dateFilter = ninetyDaysAgo;
        break;
      case "todos":
      default:
        dateFilter = undefined;
        break;
    }

    // Build where clause
    const whereClause: Prisma.OrderWhereInput = {
      providerId: session.user.id,
    };

    // Add date filter
    if (dateFilter && period !== "mais90dias") {
      whereClause.slotStart = { gte: dateFilter };
    } else if (dateFilter && period === "mais90dias") {
      whereClause.slotStart = { lt: dateFilter };
    }

    // Add status filter
    if (status !== "todos") {
      const statusMap: Record<string, string[]> = {
        agendado: ["matching", "await_cpf", "await_provider"],
        confirmado: ["accepted"],
        em_andamento: ["in_progress"],
        concluido: ["completed"],
        cancelado: ["cancelled"],
      };

      if (statusMap[status]) {
        whereClause.status = { in: statusMap[status] };
      }
    }

    const appointments = await prisma.order.findMany({
      where: whereClause,
      orderBy: {
        slotStart: "asc",
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneE164: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        address: {
          select: {
            id: true,
            street: true,
            neighborhood: true,
            city: true,
            state: true,
            number: true,
            complement: true,
          },
        },
        orderReview: {
          select: {
            rating: true,
            comment: true,
          },
        },
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching provider appointments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
