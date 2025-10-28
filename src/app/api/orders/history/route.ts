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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build where clause - only completed and cancelled orders
    const where: {
      clientId: string;
      status: { in: string[] };
      createdAt?: { gte?: Date };
      OR?: Array<{
        id?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
        provider?: { name: { contains: string; mode: "insensitive" } };
      }>;
    } = {
      clientId: session.user.id,
      status: { in: ["completed", "cancelled"] },
    };

    // Add period filter
    if (period && period !== "todos") {
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case "7dias":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30dias":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "90dias":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "mais90dias":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          where.createdAt = { gte: startDate };
          break;
        default:
          startDate = new Date(0);
      }

      if (period !== "mais90dias") {
        where.createdAt = { gte: startDate };
      }
    }

    // Add search filter
    if (search) {
      where.OR = [
        { id: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { provider: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Build orderBy clause
    const orderBy: Record<string, string> = {};
    orderBy[sortBy] = sortOrder;

    // Fetch history orders with relations
    const orders = await prisma.order.findMany({
      where,
      orderBy,
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
        address: {
          select: {
            id: true,
            street: true,
            neighborhood: true,
            city: true,
            state: true,
            number: true,
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

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching history orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
