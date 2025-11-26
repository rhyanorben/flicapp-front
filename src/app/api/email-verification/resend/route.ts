import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 }
      );
    }

    if (typeof userId !== "string") {
      return NextResponse.json(
        { error: "userId deve ser uma string" },
        { status: 400 }
      );
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: userId.trim() },
      select: { id: true, email: true, emailVerified: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    if (!user.email) {
      return NextResponse.json(
        { error: "Usuário não possui email cadastrado" },
        { status: 400 }
      );
    }

    // Se já está verificado, não precisa reenviar
    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: "Email já está verificado",
      });
    }

    const normalizedEmail = user.email.toLowerCase().trim();
    const normalizedUserId = userId.trim();

    // Invalidar códigos anteriores não verificados
    await prisma.emailVerificationCode.updateMany({
      where: {
        userId: normalizedUserId,
        verifiedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      data: {
        verifiedAt: new Date(),
      },
    });

    // Gerar novo código
    const code = generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await prisma.emailVerificationCode.create({
      data: {
        userId: normalizedUserId,
        email: normalizedEmail,
        code,
        expiresAt,
      },
    });

    // Enviar email
    try {
      await sendVerificationEmail(normalizedEmail, code);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Código de verificação reenviado com sucesso",
      ...(process.env.NODE_ENV === "development" && { code }),
    });
  } catch (error) {
    console.error("Error resending verification code:", error);
    return NextResponse.json(
      { error: "Erro ao reenviar código de verificação" },
      { status: 500 }
    );
  }
}
