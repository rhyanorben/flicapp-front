import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserRoles, assignRoleToUser } from "@/lib/role-utils";
import { convertPhoneToE164, convertE164ToWhatsAppId, normalizeE164 } from "@/lib/utils/phone-mask";
import { fetchAddressByCEP } from "@/lib/utils/viacep";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;

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
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const providerRequest = await prisma.providerRequest.findUnique({
      where: {
        id: requestId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        reviewedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!providerRequest) {
      return NextResponse.json(
        { error: "Solicitação não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(providerRequest);
  } catch (error) {
    console.error("Error fetching provider request:", error);
    return NextResponse.json(
      { error: "Erro ao buscar solicitação" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;

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
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const body = await request.json();
    const { action, rejectionReason } = body;

    if (!action || (action !== "approve" && action !== "reject")) {
      return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
    }

    if (action === "reject" && !rejectionReason) {
      return NextResponse.json(
        { error: "Motivo da rejeição é obrigatório" },
        { status: 400 }
      );
    }

    const providerRequest = await prisma.providerRequest.findUnique({
      where: {
        id: requestId,
      },
      include: {
        user: true,
      },
    });

    if (!providerRequest) {
      return NextResponse.json(
        { error: "Solicitação não encontrada" },
        { status: 404 }
      );
    }

    if (providerRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "Esta solicitação já foi processada" },
        { status: 400 }
      );
    }

    const updatedRequest = await prisma.providerRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: action === "approve" ? "APPROVED" : "REJECTED",
        rejectionReason: action === "reject" ? rejectionReason : null,
        reviewedBy: userId,
        reviewedAt: new Date(),
      },
    });

    if (action === "approve") {
      try {
        // Verify userId is valid before assigning role
        if (!providerRequest.userId || typeof providerRequest.userId !== "string") {
          throw new Error(`UserId inválido na solicitação: ${providerRequest.userId}`);
        }

        // Log the userId to debug
        console.log("Provider request userId:", providerRequest.userId);
        console.log("Provider request user:", providerRequest.user);
        console.log("Provider request user.id:", providerRequest.user?.id);

        // Use user.id if available, otherwise use providerRequest.userId
        const targetUserId = providerRequest.user?.id || providerRequest.userId;

        if (!targetUserId) {
          throw new Error("Não foi possível determinar o userId do usuário");
        }

        // Assign role first
        await assignRoleToUser(targetUserId, "PRESTADOR");

        // Ensure phone is set on user
        if (providerRequest.phone && !providerRequest.user.phoneE164) {
          try {
            let phoneE164 = convertPhoneToE164(providerRequest.phone);
            // Normalize to ensure no duplicate 9s
            phoneE164 = normalizeE164(phoneE164);
            const whatsappId = convertE164ToWhatsAppId(phoneE164);
            
            await prisma.user.update({
              where: { id: targetUserId },
              data: { 
                phoneE164,
                whatsappId,
              },
            });
          } catch (error) {
            console.error("Error updating user phone:", error);
            // Continue even if phone update fails
          }
        }

        // Ensure CPF is set on user (remove formatting to save only digits)
        if (providerRequest.documentNumber && !providerRequest.user.cpf) {
          try {
            // Remove formatting (dots, dashes, slashes) to save only digits
            const cpfDigits = providerRequest.documentNumber.replace(/\D/g, "");
            await prisma.user.update({
              where: { id: targetUserId },
              data: { cpf: cpfDigits },
            });
          } catch (error) {
            console.error("Error updating user CPF:", error);
            // Continue even if CPF update fails
          }
        }

        // Create or update provider profile
        await prisma.providerProfile.upsert({
          where: { userId: targetUserId },
          update: {},
          create: {
            userId: targetUserId,
            bio: providerRequest.description,
            radiusKm: 10,
            avgRating: 0,
            totalReviews: 0,
            acceptRate30d: 0,
            responseP50S: 0,
            noShow30d: 0,
          },
        });

        // Create provider categories from services
        if (providerRequest.services) {
          const services = Array.isArray(providerRequest.services)
            ? providerRequest.services
            : JSON.parse(providerRequest.services as string);

          for (const service of services) {
            if (service.serviceType) {
              // Find category by slug (serviceType matches slug)
              const category = await prisma.category.findUnique({
                where: { slug: service.serviceType },
              });

              if (category) {
                await prisma.providerCategory.upsert({
                  where: {
                    providerId_categoryId: {
                      providerId: targetUserId,
                      categoryId: category.id,
                    },
                  },
                  update: {
                    active: true,
                    isAvailable: true,
                  },
                  create: {
                    providerId: targetUserId,
                    categoryId: category.id,
                    minPriceCents: 5000,
                    active: true,
                    isAvailable: true,
                    levelWeight: 1,
                    expWeight: 1,
                  },
                });
              }
            }
          }
        }

        // Create address from request data if user has no active addresses
        const activeAddresses = await prisma.address.findMany({
          where: {
            userId: targetUserId,
            active: true,
          },
        });

        if (activeAddresses.length === 0 && providerRequest.cep) {
          try {
            // Try to fetch address details from CEP
            const addressData = await fetchAddressByCEP(providerRequest.cep);
            
            // Parse address string to extract number if possible
            // Format is typically: "Rua, número, bairro, cidade - UF"
            const addressParts = providerRequest.address.split(",");
            const street = addressParts[0]?.trim() || addressData?.street || "";
            const number = addressParts[1]?.trim() || "";
            const neighborhood = addressParts[2]?.trim() || addressData?.neighborhood || "";
            const cityState = addressParts[3]?.trim() || "";
            const [city, state] = cityState.split("-").map((s) => s.trim());

            await prisma.address.create({
              data: {
                userId: targetUserId,
                cep: providerRequest.cep,
                street: street || addressData?.street || "",
                number: number || undefined,
                neighborhood: neighborhood || addressData?.neighborhood || "",
                city: city || addressData?.city || "",
                state: state || addressData?.state || "",
                active: true,
              },
            });
          } catch (error) {
            console.error("Error creating address from request:", error);
            // Create address with minimal data if CEP lookup fails
            try {
              await prisma.address.create({
                data: {
                  userId: targetUserId,
                  cep: providerRequest.cep,
                  street: providerRequest.address,
                  active: true,
                },
              });
            } catch (createError) {
              console.error("Error creating minimal address:", createError);
              // Continue even if address creation fails
            }
          }
        }
      } catch (error) {
        console.error("Error in approval process:", error);
        await prisma.providerRequest.update({
          where: {
            id: requestId,
          },
          data: {
            status: "PENDING",
            reviewedBy: null,
            reviewedAt: null,
          },
        });
        return NextResponse.json(
          { error: "Erro ao processar aprovação do prestador" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message:
        action === "approve"
          ? "Solicitação aprovada com sucesso"
          : "Solicitação rejeitada",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating provider request:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
