import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";
import { getUserRoles } from "@/lib/role-utils";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const userRoles = await getUserRoles(userId);
    const isAdmin = userRoles.includes("ADMINISTRADOR");

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem visualizar usuários." },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      include: {
        userRoles: {
          include: {
            role: true,
          },
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

    const usersWithRoles = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.userRoles.map((ur) => ur.role.name),
      hasProviderRequest: user.providerRequests.length > 0,
      providerRequestStatus: user.providerRequests[0]?.status || null,
    }));

    return NextResponse.json(usersWithRoles);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuários" },
      { status: 500 }
    );
  }
}

