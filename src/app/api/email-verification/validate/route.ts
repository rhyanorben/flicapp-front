import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, code } = body;

    // Validações de entrada
    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { success: false, message: "userId é obrigatório" },
        { status: 400 }
      );
    }

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, message: "Código é obrigatório" },
        { status: 400 }
      );
    }

    // Normalizar código
    const normalizedCode = code.trim();

    // Buscar código válido (não expirado, não verificado)
    const verificationCode = await prisma.emailVerificationCode.findFirst({
      where: {
        userId: userId,
        code: normalizedCode,
        verifiedAt: null,
        expiresAt: {
          gt: new Date(), // Ainda não expirou
        },
      },
      orderBy: {
        createdAt: "desc", // Pega o mais recente
      },
    });

    if (!verificationCode) {
      return NextResponse.json({
        success: false,
        message: "Código inválido ou expirado",
      });
    }

    // Marcar código como verificado
    await prisma.emailVerificationCode.update({
      where: {
        id: verificationCode.id,
      },
      data: {
        verifiedAt: new Date(),
      },
    });

    // Atualizar emailVerified do usuário
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        emailVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Código verificado com sucesso",
    });
  } catch (error) {
    console.error("Error validating verification code:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao validar código de verificação" },
      { status: 500 }
    );
  }
}
