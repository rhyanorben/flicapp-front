import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserRoles } from "@/lib/role-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const adminUserId = session.user.id;
    const userRoles = await getUserRoles(adminUserId);
    const isAdmin = userRoles.includes("ADMINISTRADOR");

    if (!isAdmin) {
      return NextResponse.json(
        {
          error:
            "Acesso negado. Apenas administradores podem visualizar detalhes de usuários.",
        },
        { status: 403 }
      );
    }

    // Fetch user with all related data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        providerProfile: true,
        providerCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        addresses: {
          where: {
            active: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1, // Get only the most recent active address
        },
        providerRequests: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Structure the response
    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      phoneE164: user.phoneE164,
      cpf: user.cpf,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.userRoles.map((ur) => ur.role.name),
      // Provider-specific data
      providerProfile: user.providerProfile
        ? {
            bio: user.providerProfile.bio,
            radiusKm: Number(user.providerProfile.radiusKm),
            avgRating: Number(user.providerProfile.avgRating),
            totalReviews: user.providerProfile.totalReviews,
            acceptRate30d: Number(user.providerProfile.acceptRate30d),
            responseP50S: user.providerProfile.responseP50S,
            noShow30d: user.providerProfile.noShow30d,
          }
        : null,
      providerCategories: user.providerCategories.map((pc) => ({
        id: pc.id,
        categoryId: pc.categoryId,
        categoryName: pc.category.name,
        categorySlug: pc.category.slug,
        minPriceCents: pc.minPriceCents,
        active: pc.active,
        isAvailable: pc.isAvailable,
        levelWeight: pc.levelWeight,
        expWeight: pc.expWeight,
        score: pc.score ? Number(pc.score) : null,
        updatedAt: pc.updatedAt,
      })),
      activeAddress: user.addresses[0]
        ? {
            id: user.addresses[0].id,
            label: user.addresses[0].label,
            cep: user.addresses[0].cep,
            street: user.addresses[0].street,
            number: user.addresses[0].number,
            complement: user.addresses[0].complement,
            neighborhood: user.addresses[0].neighborhood,
            city: user.addresses[0].city,
            state: user.addresses[0].state,
            lat: user.addresses[0].lat,
            lon: user.addresses[0].lon,
            active: user.addresses[0].active,
            createdAt: user.addresses[0].createdAt,
          }
        : null,
      hasProviderRequest: user.providerRequests.length > 0,
      providerRequestStatus: user.providerRequests[0]?.status || null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "Erro ao buscar detalhes do usuário" },
      { status: 500 }
    );
  }
}

