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

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "todos"; // e.g., "7dias", "30dias", "90dias", "mais90dias"
    const rating = searchParams.get("rating") || "todos"; // e.g., "todos", "5", "4", "3", "2", "1"

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
    const whereClause: any = {
      providerId: session.user.id,
    };

    // Add date filter
    if (dateFilter && period !== "mais90dias") {
      whereClause.createdAt = { gte: dateFilter };
    } else if (dateFilter && period === "mais90dias") {
      whereClause.createdAt = { lt: dateFilter };
    }

    // Add rating filter
    if (rating !== "todos") {
      whereClause.rating = parseInt(rating);
    }

    const ratings = await prisma.orderReview.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        order: {
          select: {
            id: true,
            description: true,
            createdAt: true,
            category: {
              select: {
                name: true,
                slug: true,
              },
            },
            client: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(ratings);
  } catch (error) {
    console.error("Error fetching provider ratings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
