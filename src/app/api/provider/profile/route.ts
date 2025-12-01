import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserRoles } from "@/lib/role-utils";
import { convertPhoneToE164, convertE164ToWhatsAppId, normalizeE164 } from "@/lib/utils/phone-mask";
import { z } from "zod";

// Validation schemas
const updateProfileSchema = z.object({
  bio: z.string().max(1000).optional(),
  radiusKm: z.number().min(1).max(100).optional(),
});

const updateCategorySchema = z.object({
  id: z.string(),
  minPriceCents: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
});

const updateAddressSchema = z.object({
  label: z.string().max(100).optional(),
  cep: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().max(2).optional(),
  lat: z.number().optional(),
  lon: z.number().optional(),
});

const updateProviderSchema = z.object({
  profile: updateProfileSchema.optional(),
  categories: z.array(updateCategorySchema).optional(),
  address: updateAddressSchema.optional(),
  phone: z.string().optional(),
});

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
    const isProvider = userRoles.includes("PRESTADOR");

    if (!isProvider) {
      return NextResponse.json(
        {
          error:
            "Acesso negado. Apenas prestadores podem visualizar este perfil.",
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
    console.error("Error fetching provider profile:", error);
    return NextResponse.json(
      { error: "Erro ao buscar perfil do prestador" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const userId = session.user.id;
    const userRoles = await getUserRoles(userId);
    const isProvider = userRoles.includes("PRESTADOR");

    if (!isProvider) {
      return NextResponse.json(
        {
          error:
            "Acesso negado. Apenas prestadores podem atualizar este perfil.",
        },
        { status: 403 }
      );
    }

    // Verify user exists and is a provider
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updateProviderSchema.parse(body);

    // Update profile if provided
    if (validatedData.profile) {
      const profileData: {
        bio?: string;
        radiusKm?: number;
      } = {};

      if (validatedData.profile.bio !== undefined) {
        profileData.bio = validatedData.profile.bio;
      }
      if (validatedData.profile.radiusKm !== undefined) {
        profileData.radiusKm = validatedData.profile.radiusKm;
      }

      await prisma.providerProfile.upsert({
        where: { userId },
        update: profileData,
        create: {
          userId,
          bio: profileData.bio || null,
          radiusKm: profileData.radiusKm || 10,
        },
      });
    }

    // Update categories if provided
    if (validatedData.categories && validatedData.categories.length > 0) {
      for (const categoryUpdate of validatedData.categories) {
        // Verify category belongs to this provider
        const existingCategory = await prisma.providerCategory.findFirst({
          where: {
            id: categoryUpdate.id,
            providerId: userId,
          },
        });

        if (!existingCategory) {
          return NextResponse.json(
            { error: "Categoria não encontrada ou não pertence a este prestador" },
            { status: 404 }
          );
        }

        const categoryData: {
          minPriceCents?: number;
          active?: boolean;
          isAvailable?: boolean;
        } = {};

        if (categoryUpdate.minPriceCents !== undefined) {
          categoryData.minPriceCents = categoryUpdate.minPriceCents;
        }
        if (categoryUpdate.active !== undefined) {
          categoryData.active = categoryUpdate.active;
        }
        if (categoryUpdate.isAvailable !== undefined) {
          categoryData.isAvailable = categoryUpdate.isAvailable;
        }

        await prisma.providerCategory.update({
          where: { id: categoryUpdate.id },
          data: categoryData,
        });
      }
    }

    // Update address if provided
    if (validatedData.address) {
      const activeAddress = await prisma.address.findFirst({
        where: {
          userId,
          active: true,
        },
      });

      if (activeAddress) {
        await prisma.address.update({
          where: { id: activeAddress.id },
          data: validatedData.address,
        });
      } else {
        // Create new active address if none exists
        await prisma.address.create({
          data: {
            userId,
            ...validatedData.address,
            active: true,
          },
        });
      }
    }

    // Update phone if provided
    if (validatedData.phone) {
      try {
        let phoneE164 = convertPhoneToE164(validatedData.phone);
        // Normalize to ensure no duplicate 9s
        phoneE164 = normalizeE164(phoneE164);
        const whatsappId = convertE164ToWhatsAppId(phoneE164);
        
        await prisma.user.update({
          where: { id: userId },
          data: { 
            phoneE164,
            whatsappId,
          },
        });
      } catch {
        return NextResponse.json(
          { error: "Formato de telefone inválido" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      message: "Informações do prestador atualizadas com sucesso",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating provider profile:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar perfil do prestador" },
      { status: 500 }
    );
  }
}

