import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { randomUUID } from "crypto";

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true },
    });

    // Por segurança, não revelamos se o email existe ou não
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Se o email existir, você receberá um link de recuperação",
      });
    }

    // Gerar token único
    const token = randomUUID();
    const code = generateVerificationCode();

    // Calcular expiração (1 hora para token, 10 minutos para código)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Invalidar tokens anteriores não usados
    await prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      data: {
        usedAt: new Date(), // Marca como usado para invalidar
      },
    });

    // Criar novo token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        code,
        expiresAt,
      },
    });

    // Enviar email com código e link
    try {
      await sendPasswordResetEmail(normalizedEmail, code, token);
    } catch (emailError) {
      console.error("Error sending password reset email:", emailError);
      // Não falha a requisição se o email não for enviado
    }

    return NextResponse.json({
      success: true,
      message: "Se o email existir, você receberá um link de recuperação",
      ...(process.env.NODE_ENV === "development" && { code, token }),
    });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return NextResponse.json(
      { error: "Erro ao solicitar recuperação de senha" },
      { status: 500 }
    );
  }
}
