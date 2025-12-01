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
    const sortBy = searchParams.get("sortBy") || "sentAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build where clause - order invitations sent to this provider
    const where: Prisma.OrderInvitationWhereInput = {
      providerId: session.user.id,
    };

    // Add search filter
    if (search) {
      where.AND = [
        {
          OR: [
            { id: { contains: search, mode: "insensitive" } },
            { order: { id: { contains: search, mode: "insensitive" } } },
            { order: { description: { contains: search, mode: "insensitive" } } },
            { order: { client: { name: { contains: search, mode: "insensitive" } } } },
          ],
        },
      ];
    }

    // Build orderBy clause
    let orderBy: Prisma.OrderInvitationOrderByWithRelationInput;
    // Map sortBy to OrderInvitation fields or order fields
    if (sortBy === "createdAt" || sortBy === "sentAt") {
      orderBy = { sentAt: sortOrder as "asc" | "desc" };
    } else if (sortBy === "dataSolicitacao") {
      orderBy = { order: { createdAt: sortOrder as "asc" | "desc" } };
    } else if (sortBy === "cliente") {
      orderBy = { order: { client: { name: sortOrder as "asc" | "desc" } } };
    } else if (sortBy === "tipoServico") {
      orderBy = { order: { category: { name: sortOrder as "asc" | "desc" } } };
    } else if (sortBy === "valor") {
      orderBy = { order: { finalPriceCents: sortOrder as "asc" | "desc" } };
    } else {
      // Default to sentAt
      orderBy = { sentAt: "desc" };
    }

    // Fetch order invitations with order relations
    const invitations = await prisma.orderInvitation.findMany({
      where,
      orderBy,
      include: {
        order: {
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
        },
      },
    });

    // Transform to match expected structure (combining invitation and order data)
    const requests = invitations.map((invitation) => ({
      // OrderInvitation fields
      invitationId: invitation.id,
      respondedAt: invitation.respondedAt?.toISOString() || null,
      response: invitation.response,
      expiresAt: invitation.expiresAt?.toISOString() || null,
      sentAt: invitation.sentAt.toISOString(),
      status: invitation.status,
      // Order fields (for compatibility)
      id: invitation.order.id,
      clientId: invitation.order.clientId,
      providerId: invitation.order.providerId,
      addressId: invitation.order.addressId,
      categoryId: invitation.order.categoryId,
      description: invitation.order.description,
      depositMethod: invitation.order.depositMethod,
      depositBaseAvgCents: invitation.order.depositBaseAvgCents,
      depositCents: invitation.order.depositCents,
      slotStart: invitation.order.slotStart?.toISOString() || null,
      slotEnd: invitation.order.slotEnd?.toISOString() || null,
      finalPriceCents: invitation.order.finalPriceCents,
      reviewStatus: invitation.order.reviewStatus,
      orderStatus: invitation.order.status, // Include order status for mapping
      createdAt: invitation.order.createdAt.toISOString(),
      updatedAt: invitation.order.updatedAt.toISOString(),
      // Relations
      category: invitation.order.category,
      client: invitation.order.client,
      address: invitation.order.address,
    }));

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching provider requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
