import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

// Função para gerar código de 6 dígitos
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Função para validar formato de email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

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

    const { userId, email } = body;

    // Validação de userId
    if (!userId) {
      console.error("Error: userId é obrigatório. Body recebido:", body);
      return NextResponse.json(
        { error: "userId é obrigatório", received: body },
        { status: 400 }
      );
    }

    if (typeof userId !== "string") {
      console.error("Error: userId deve ser string. Tipo recebido:", typeof userId, "Valor:", userId);
      return NextResponse.json(
        { error: "userId deve ser uma string", received: typeof userId },
        { status: 400 }
      );
    }

    if (userId.trim().length === 0) {
      console.error("Error: userId está vazio");
      return NextResponse.json(
        { error: "userId não pode estar vazio" },
        { status: 400 }
      );
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: userId.trim() },
      select: { id: true, email: true },
    });

    if (!user) {
      console.error("Error: Usuário não encontrado. userId:", userId);
      return NextResponse.json(
        { error: "Usuário não encontrado", userId: userId },
        { status: 404 }
      );
    }

    // Determinar qual email usar: do body ou do usuário
    let emailToUse: string;
    if (email) {
      // Validar formato do email recebido
      if (typeof email !== "string" || !isValidEmail(email)) {
        return NextResponse.json(
          { error: "Email inválido" },
          { status: 400 }
        );
      }
      emailToUse = email.toLowerCase().trim();
    } else if (user.email) {
      // Usar email do usuário se não foi fornecido no body
      emailToUse = user.email.toLowerCase().trim();
    } else {
      // Se não tem email nem no body nem no usuário, retornar erro
      return NextResponse.json(
        { error: "Email é obrigatório. Forneça um email no body da requisição ou cadastre um email no usuário." },
        { status: 400 }
      );
    }

    // Normalizar
    const normalizedEmail = emailToUse;
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
      console.log("Enviando email de verificação para:", normalizedEmail);
      await sendVerificationEmail(normalizedEmail, code);
      console.log("Email de verificação enviado com sucesso");
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      // Retornar erro 400 se houver problema na configuração SMTP
      if (emailError instanceof Error && emailError.message.includes("SMTP")) {
        return NextResponse.json(
          { 
            error: "Erro na configuração de email. Entre em contato com o suporte.",
            details: process.env.NODE_ENV === "development" ? emailError.message : undefined
          },
          { status: 400 }
        );
      }
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
