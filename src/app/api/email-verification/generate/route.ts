import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

// Função para gerar código de 6 dígitos
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Função para validar formato de email
// function isValidEmail(email: string): boolean {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// }

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return NextResponse.json(
        { error: "Corpo da requisição inválido. Deve ser JSON válido." },
        { status: 400 }
      );
    }

    const { userId } = body;

    // Validação de userId
    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório", received: body },
        { status: 400 }
      );
    }

    if (typeof userId !== "string") {
      return NextResponse.json(
        { error: "userId deve ser uma string", received: typeof userId },
        { status: 400 }
      );
    }

    if (userId.trim().length === 0) {
      return NextResponse.json(
        { error: "userId não pode estar vazio" },
        { status: 400 }
      );
    }

    // Buscar usuário para obter o email
    const user = await prisma.user.findUnique({
      where: { id: userId.trim() },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado", userId: userId },
        { status: 404 }
      );
    }

    if (!user.email) {
      return NextResponse.json(
        { error: "Usuário não possui email cadastrado", userId: userId },
        { status: 400 }
      );
    }

    // Normalizar email (lowercase)
    const normalizedEmail = user.email.toLowerCase().trim();
    const normalizedUserId = userId.trim();

    // Invalidar códigos anteriores não verificados para este userId
    await prisma.emailVerificationCode.updateMany({
      where: {
        userId: normalizedUserId,
        verifiedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      data: {
        verifiedAt: new Date(), // Marca como "usado" para invalidar
      },
    });

    // Gerar novo código
    const code = generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Expira em 10 minutos

    // Salvar código no banco
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
      // Não falha a requisição se o email não for enviado, mas loga o erro
      // Em produção, você pode querer tratar isso de forma diferente
    }

    // Retornar sucesso (não retornar o código em produção)
    return NextResponse.json({
      success: true,
      message: "Código de verificação enviado com sucesso",
      // Em desenvolvimento, pode ser útil retornar o código para debug
      ...(process.env.NODE_ENV === "development" && { code }),
    });
  } catch (error) {
    console.error("Error generating verification code:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      {
        error: "Erro ao gerar código de verificação",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
