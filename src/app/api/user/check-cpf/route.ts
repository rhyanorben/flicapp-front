import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateCPF } from "@/lib/utils/document-validation";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { cpf } = body;

    if (!cpf) {
      return NextResponse.json(
        { error: "CPF não fornecido" },
        { status: 400 }
      );
    }

    // Remove formatting to get only numbers
    const cpfNumbers = cpf.replace(/\D/g, "");

    // Validate CPF format
    if (cpfNumbers.length !== 11) {
      return NextResponse.json(
        { error: "CPF deve ter 11 dígitos" },
        { status: 400 }
      );
    }

    // Validate CPF algorithm
    if (!validateCPF(cpf)) {
      return NextResponse.json(
        { error: "CPF inválido" },
        { status: 400 }
      );
    }

    // Check if CPF exists in database (excluding current user's CPF)
    const existingUser = await prisma.user.findFirst({
      where: {
        cpf: cpfNumbers,
        NOT: {
          id: session.user.id,
        },
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({
      exists: !!existingUser,
    });
  } catch (error) {
    console.error("Error checking CPF:", error);
    return NextResponse.json(
      { error: "Erro ao verificar CPF" },
      { status: 500 }
    );
  }
}

