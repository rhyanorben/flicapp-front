import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Helper function to calculate percentage delta
const calculateDelta = (previous: number, current: number): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
};

// Map OrderInvitation status to display category
const mapInvitationStatusToCategory = (
  invitation: {
    respondedAt: Date | null;
    response: string | null;
    status: string | null;
    expiresAt: Date | null;
    order: { status: string };
  }
): string => {
  const now = new Date();
  const hasExpired =
    invitation.expiresAt && new Date(invitation.expiresAt) < now;
  const isResponded = invitation.respondedAt !== null;

  // Expirada: expiresAt < agora E respondedAt é null
  if (hasExpired && !isResponded) {
    return "expiradas";
  }

  // Aceita: response === "accepted" OU status indica aceito OU order.status é "accepted"/"in_progress"/"completed"
  if (
    invitation.response === "accepted" ||
    invitation.status === "accepted" ||
    ["accepted", "in_progress", "completed"].includes(invitation.order.status)
  ) {
    return "aceitas";
  }

  // Recusada: response === "rejected" OU status indica rejeitado OU order.status é "cancelled"
  if (
    invitation.response === "rejected" ||
    invitation.status === "rejected" ||
    invitation.order.status === "cancelled"
  ) {
    return "recusadas";
  }

  // Pendente: respondedAt é null E (expiresAt é null OU expiresAt > agora)
  if (!isResponded && (!invitation.expiresAt || !hasExpired)) {
    return "pendentes";
  }

  // Default to pendente
  return "pendentes";
};

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current month's stats
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);

    // Get order invitations for this provider
    const currentMonthInvitations = await prisma.orderInvitation.findMany({
      where: {
        providerId: session.user.id,
        sentAt: { gte: currentMonthStart },
      },
      include: {
        order: {
          select: {
            status: true,
            finalPriceCents: true,
          },
        },
      },
    });

    // Get previous month's stats
    const previousMonthStart = new Date(currentMonthStart);
    previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);

    const previousMonthInvitations = await prisma.orderInvitation.findMany({
      where: {
        providerId: session.user.id,
        sentAt: {
          gte: previousMonthStart,
          lt: currentMonthStart,
        },
      },
      include: {
        order: {
          select: {
            status: true,
            finalPriceCents: true,
          },
        },
      },
    });

    // Calculate current stats
    const currentStats = {
      pendentes: 0,
      aceitas: 0,
      recusadas: 0,
      expiradas: 0,
      totalGanhos: 0,
    };

    currentMonthInvitations.forEach((invitation) => {
      const category = mapInvitationStatusToCategory(invitation);
      currentStats[category as keyof typeof currentStats]++;

      if (category === "aceitas" && invitation.order.finalPriceCents) {
        currentStats.totalGanhos += invitation.order.finalPriceCents / 100;
      }
    });

    // Calculate previous stats
    const previousStats = {
      pendentes: 0,
      aceitas: 0,
      recusadas: 0,
      expiradas: 0,
      totalGanhos: 0,
    };

    previousMonthInvitations.forEach((invitation) => {
      const category = mapInvitationStatusToCategory(invitation);
      previousStats[category as keyof typeof previousStats]++;

      if (category === "aceitas" && invitation.order.finalPriceCents) {
        previousStats.totalGanhos += invitation.order.finalPriceCents / 100;
      }
    });

    // Calculate deltas (percentage change)
    const deltas = {
      pendentes: calculateDelta(
        previousStats.pendentes,
        currentStats.pendentes
      ),
      aceitas: calculateDelta(previousStats.aceitas, currentStats.aceitas),
      recusadas: calculateDelta(
        previousStats.recusadas,
        currentStats.recusadas
      ),
      expiradas: calculateDelta(
        previousStats.expiradas,
        currentStats.expiradas
      ),
      totalGanhos: calculateDelta(
        previousStats.totalGanhos,
        currentStats.totalGanhos
      ),
    };

    return NextResponse.json({
      stats: currentStats,
      deltas,
    });
  } catch (error) {
    console.error("Error fetching provider request stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
