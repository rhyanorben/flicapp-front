import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string().optional(),
  code: z.string().optional(),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .max(20, "A senha deve ter no máximo 20 caracteres"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar dados
    const validationResult = resetPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      const errorMessage =
        validationResult.error.issues[0]?.message || "Dados inválidos";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { token, code, password } = validationResult.data;

    if (!token && !code) {
      return NextResponse.json(
        { error: "Token ou código é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar token válido
    let resetToken;

    if (token) {
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
      return NextResponse.json(
        { error: "Token ou código inválido ou expirado" },
        { status: 400 }
      );
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: resetToken.userId },
      select: { id: true, email: true },
    });

    if (!user || !user.email) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Usar a API do better-auth para atualizar a senha
    // O better-auth gerencia o hash de senha internamente
    try {
      // Primeiro, precisamos criar uma sessão temporária ou usar a API de mudança de senha
      // Como não temos a senha atual, vamos usar a API de reset de senha do better-auth
      // Se não houver API específica, vamos usar o método interno de hash do better-auth

      // Verificar se há uma API de reset de senha no better-auth
      // Por enquanto, vamos usar o método de atualização direta mas com o hash correto
      const account = await prisma.account.findFirst({
        where: {
          userId: user.id,
          providerId: "credential",
        },
      });

      if (!account) {
        return NextResponse.json(
          { error: "Conta não encontrada" },
          { status: 404 }
        );
      }

      // O better-auth usa scrypt com formato específico: salt:key (ambos em hex)
      // Configuração: N=16384, r=16, p=1, dkLen=64
      // Usar a mesma biblioteca que o better-auth usa
      const { scryptAsync } = await import("@noble/hashes/scrypt.js");
      const { hex } = await import("@better-auth/utils/hex");

      // Gerar salt aleatório (16 bytes) usando crypto.getRandomValues como o better-auth
      const saltBytes = new Uint8Array(16);
      if (
        typeof globalThis !== "undefined" &&
        globalThis.crypto?.getRandomValues
      ) {
        globalThis.crypto.getRandomValues(saltBytes);
      } else {
        const nodeCrypto = await import("crypto");
        const randomBytes = nodeCrypto.randomBytes(16);
        saltBytes.set(randomBytes);
      }

      // Converter salt para hex (como o better-auth faz)
      const saltHex = hex.encode(saltBytes);

      // Normalizar senha (NFKC) como o better-auth faz
      const normalizedPassword = password.normalize("NFKC");

      // Hash usando scrypt com os parâmetros do better-auth
      // O generateKey do better-auth recebe salt como string hex
      // better-auth usa: N=16384, r=16, p=1, dkLen=64
      const key = await scryptAsync(normalizedPassword, saltHex, {
        N: 16384,
        r: 16,
        p: 1,
        dkLen: 64,
        maxmem: 128 * 16384 * 16 * 2,
      });

      // Formato do better-auth: salt:key (ambos em hex usando hex.encode)
      const keyHex = hex.encode(key);
      const formattedHash = `${saltHex}:${keyHex}`;

      // Atualizar senha na tabela Account
      await prisma.account.update({
        where: {
          id: account.id,
        },
        data: {
          password: formattedHash,
        },
      });
    } catch (error) {
      console.error("Error updating password:", error);
      return NextResponse.json(
        { error: "Erro ao atualizar senha" },
        { status: 500 }
      );
    }

    // Marcar token como usado
    await prisma.passwordResetToken.update({
      where: {
        id: resetToken.id,
      },
      data: {
        usedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Senha redefinida com sucesso",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Erro ao redefinir senha" },
      { status: 500 }
    );
  }
}
