import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const prisma = new PrismaClient();

const registerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .max(20, "A senha deve ter no máximo 20 caracteres"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar dados com Zod
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      const errorMessage =
        validationResult.error.issues[0]?.message || "Dados inválidos";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { name, email, password } = validationResult.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está em uso" },
        { status: 400 }
      );
    }

    const signUpResponse = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (!signUpResponse) {
      return NextResponse.json(
        { error: "Erro ao criar usuário" },
        { status: 500 }
      );
    }

    const userId = (signUpResponse as { user?: { id: string } })?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Usuário criado mas ID não encontrado" },
        { status: 500 }
      );
    }

    let clienteRole = await prisma.role.findFirst({
      where: { name: "CLIENTE" },
    });

    if (!clienteRole) {
      clienteRole = await prisma.role.create({
        data: { name: "CLIENTE" },
      });
    }

    await prisma.userRoleAssignment.create({
      data: {
        userId: userId,
        roleId: clienteRole.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Usuário registrado com sucesso",
        user: (signUpResponse as { user?: unknown })?.user,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error)?.message || "Erro ao registrar usuário" },
      { status: 500 }
    );
  }
}
