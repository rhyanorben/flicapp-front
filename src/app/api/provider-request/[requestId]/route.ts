import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";
import { getUserRoles, assignRoleToUser } from "@/lib/role-utils";

const prisma = new PrismaClient();

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
        await assignRoleToUser(providerRequest.userId, "PRESTADOR");
      } catch (error) {
        console.error("Error assigning role:", error);
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
          { error: "Erro ao atribuir papel de prestador" },
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
