import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, code } = body;

    if (!token && !code) {
      return NextResponse.json(
        { error: "Token ou código é obrigatório" },
        { status: 400 }
      );
    }

    let resetToken;

    if (token) {
      // Validar por token
      resetToken = await prisma.passwordResetToken.findFirst({
        where: {
          token: token,
          usedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
      });
    } else if (code) {
      // Validar por código
      const normalizedCode = code.trim();
      resetToken = await prisma.passwordResetToken.findFirst({
        where: {
          code: normalizedCode,
          usedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    if (!resetToken) {
      return NextResponse.json({
        success: false,
        message: "Token ou código inválido ou expirado",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Token ou código válido",
      userId: resetToken.userId,
    });
  } catch (error) {
    console.error("Error validating password reset token:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao validar token ou código" },
      { status: 500 }
    );
  }
}
