import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";
import { getUserRoles } from "@/lib/role-utils";

const prisma = new PrismaClient();

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
      description,
      experience,
      phone,
      address,
      documentNumber,
      portfolioLinks,
    } = body;

    if (!description || !experience || !phone || !address || !documentNumber) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos" },
        { status: 400 }
      );
    }

    const providerRequest = await prisma.providerRequest.create({
      data: {
        userId,
        description,
        experience,
        phone,
        address,
        documentNumber,
        portfolioLinks: portfolioLinks || null,
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
