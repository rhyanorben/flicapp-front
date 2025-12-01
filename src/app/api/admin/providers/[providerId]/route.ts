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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ providerId: string }> }
) {
  try {
    const { providerId } = await params;

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
            "Acesso negado. Apenas administradores podem atualizar informações de prestadores.",
        },
        { status: 403 }
      );
    }

    // Verify user exists and is a provider
    const user = await prisma.user.findUnique({
      where: { id: providerId },
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

    const isProvider = user.userRoles.some(
      (ur) => ur.role.name === "PRESTADOR"
    );

    if (!isProvider) {
      return NextResponse.json(
        { error: "Usuário não é um prestador" },
        { status: 400 }
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
        where: { userId: providerId },
        update: profileData,
        create: {
          userId: providerId,
          bio: profileData.bio || null,
          radiusKm: profileData.radiusKm || 10,
        },
      });
    }

    // Update categories if provided
    if (validatedData.categories && validatedData.categories.length > 0) {
      for (const categoryUpdate of validatedData.categories) {
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
          userId: providerId,
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
            userId: providerId,
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
          where: { id: providerId },
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

    console.error("Error updating provider:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar informações do prestador" },
      { status: 500 }
    );
  }
}
