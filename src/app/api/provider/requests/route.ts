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
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build where clause - orders that are assigned to this provider or available for matching
    const where: Prisma.OrderWhereInput = {
      OR: [
        // Orders assigned to this provider
        { providerId: session.user.id },
        // Orders available for matching (matching status, no provider assigned)
        {
          AND: [{ status: "matching" }, { providerId: null }],
        },
      ],
    };

    // Add search filter
    if (search) {
      where.AND = [
        {
          OR: [
            { id: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { client: { name: { contains: search, mode: "insensitive" } } },
          ],
        },
      ];
    }

    // Build orderBy clause
    const orderBy: Record<string, string> = {};
    orderBy[sortBy] = sortOrder;

    // Fetch provider requests with relations
    const requests = await prisma.order.findMany({
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
        client: {
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
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching provider requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
