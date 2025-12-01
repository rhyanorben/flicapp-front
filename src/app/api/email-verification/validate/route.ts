import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mergeUsers } from "@/lib/utils/user-merge";

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

    // Obter o email do código de verificação
    const emailToVerify = verificationCode.email.toLowerCase().trim();

    // Verificar se esse email já existe em outro usuário
    const existingUserWithEmail = await prisma.user.findUnique({
      where: { email: emailToVerify },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        createdAt: true,
        phoneE164: true,
        cpf: true,
      },
    });

    let finalUserId = userId;
    let merged = false;

    // Se o email já existe em outro usuário, fazer merge
    if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
      console.log(
        `Email ${emailToVerify} já existe no usuário ${existingUserWithEmail.id}. Iniciando merge com usuário ${userId}`
      );

      try {
        // Fazer merge: manter o usuário que já tinha o email e migrar dados do usuário atual
        finalUserId = await mergeUsers(existingUserWithEmail.id, userId);
        merged = true;
        console.log(`Merge concluído. Usuário final: ${finalUserId}`);
      } catch (mergeError) {
        console.error("Erro ao fazer merge de usuários:", mergeError);
        throw new Error(
          `Erro ao unificar contas: ${mergeError instanceof Error ? mergeError.message : "Erro desconhecido"}`
        );
      }
    } else {
      // Se não existe outro usuário, atualizar o email do usuário atual
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      // Atualizar email e marcar como verificado
      const updateData: {
        email?: string;
        emailVerified: boolean;
      } = {
        emailVerified: true,
      };

      // Só atualizar o email se ainda não estiver cadastrado ou for diferente
      if (!currentUser?.email || currentUser.email.toLowerCase() !== emailToVerify) {
        updateData.email = emailToVerify;
      }

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: updateData,
      });

      console.log(`Email ${emailToVerify} atualizado e verificado para usuário ${userId}`);
    }

    return NextResponse.json({
      success: true,
      message: merged
        ? "Código verificado com sucesso. Sua conta foi unificada com uma conta existente."
        : "Código verificado com sucesso",
      userId: finalUserId,
      merged,
    });
  } catch (error) {
    console.error("Error validating verification code:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao validar código de verificação" },
      { status: 500 }
    );
  }
}
