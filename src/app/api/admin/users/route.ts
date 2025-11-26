import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserRoles } from "@/lib/role-utils";
import { Prisma, UserRole } from "@/app/generated/prisma";

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
            "Acesso negado. Apenas administradores podem visualizar usuários.",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get("role");

    // Build where clause for role filtering
    const whereClause: Prisma.UserWhereInput = {};

    if (roleFilter && roleFilter !== "todos") {
      // Validate that roleFilter is a valid UserRole enum value
      const validRoles = Object.values(UserRole);
      if (validRoles.includes(roleFilter as UserRole)) {
        whereClause.userRoles = {
          some: {
            role: {
              name: roleFilter as UserRole,
            },
          },
        };
      }
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        providerProfile: {
          select: {
            avgRating: true,
            totalReviews: true,
          },
        },
        providerCategories: {
          select: {
            id: true,
            active: true,
          },
        },
        addresses: {
          where: {
            active: true,
          },
          select: {
            id: true,
          },
          take: 1,
        },
        providerRequests: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const usersWithRoles = users.map((user) => {
      const roles = user.userRoles.map((ur) => ur.role.name);
      const isProvider = roles.includes("PRESTADOR");

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        phoneE164: user.phoneE164,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        roles,
        hasProviderRequest: user.providerRequests.length > 0,
        providerRequestStatus: user.providerRequests[0]?.status || null,
        // Provider summary data
        providerSummary: isProvider
          ? {
              hasProfile: !!user.providerProfile,
              avgRating: user.providerProfile
                ? Number(user.providerProfile.avgRating)
                : 0,
              totalReviews: user.providerProfile?.totalReviews || 0,
              categoriesCount: user.providerCategories.length,
              activeCategoriesCount: user.providerCategories.filter(
                (pc) => pc.active
              ).length,
              hasActiveAddress: user.addresses.length > 0,
            }
          : null,
      };
    });

    return NextResponse.json(usersWithRoles);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuários" },
      { status: 500 }
    );
  }
}
