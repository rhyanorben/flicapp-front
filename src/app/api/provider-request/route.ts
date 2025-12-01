import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserRoles } from "@/lib/role-utils";
import { convertPhoneToE164, convertE164ToWhatsAppId, normalizeE164 } from "@/lib/utils/phone-mask";

export async function POST(request: NextRequest) {
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
    if (isProvider) {
      return NextResponse.json(
        { error: "Você já é um prestador de serviços" },
        { status: 400 }
      );
    }

    const existingRequest = await prisma.providerRequest.findFirst({
      where: {
        userId,
        status: "PENDING",
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "Você já possui uma solicitação pendente" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      services,
      description,
      experience,
      phone,
      cep,
      address,
      documentNumber,
      portfolioLinks,
    } = body;

    if (
      !services ||
      !description ||
      !experience ||
      !phone ||
      !cep ||
      !address ||
      !documentNumber
    ) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos" },
        { status: 400 }
      );
    }

    // Convert phone to E164 format and update user
    let phoneE164: string | undefined;
    try {
      phoneE164 = convertPhoneToE164(phone);
      // Normalize to ensure no duplicate 9s
      if (phoneE164) {
        phoneE164 = normalizeE164(phoneE164);
        const whatsappId = convertE164ToWhatsAppId(phoneE164);
        
        await prisma.user.update({
          where: { id: userId },
          data: { 
            phoneE164,
            whatsappId,
          },
        });
      }
    } catch (error) {
      console.error("Error converting phone to E164:", error);
      // Continue with request creation even if phone conversion fails
    }

    const providerRequest = await prisma.providerRequest.create({
      data: {
        userId,
        services: services || null,
        description,
        experience,
        phone,
        cep,
        address,
        documentNumber,
        portfolioLinks: portfolioLinks ? JSON.stringify(portfolioLinks) : null,
        portfolioLinksJson: portfolioLinks || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        message: "Solicitação enviada com sucesso",
        request: providerRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating provider request:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const userId = session.user.id;

    const providerRequests = await prisma.providerRequest.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(providerRequests);
  } catch (error) {
    console.error("Error fetching provider requests:", error);
    return NextResponse.json(
      { error: "Erro ao buscar solicitações" },
      { status: 500 }
    );
  }
}
