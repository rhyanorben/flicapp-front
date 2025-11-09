import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(5, "O nome deve ter pelo menos 5 caracteres"),
  phoneE164: z
    .string()
    .regex(/^\+55\d{10,11}$/, "Formato de telefone inválido"),
  cpf: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get params
    const { userId } = await params;

    // Verify user can access this data (own data only)
    if (session.user.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Check if user already has a CPF and prevent updating it
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { cpf: true },
    });

    // Only prevent CPF change if user already has a CPF and is trying to change it
    if (
      existingUser?.cpf &&
      validatedData.cpf &&
      validatedData.cpf.trim() !== "" &&
      existingUser.cpf !== validatedData.cpf
    ) {
      return NextResponse.json(
        { error: "CPF não pode ser alterado após o cadastro" },
        { status: 400 }
      );
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedData.name,
        phoneE164: validatedData.phoneE164,
        ...(validatedData.cpf &&
          validatedData.cpf.trim() !== "" &&
          !existingUser?.cpf && { cpf: validatedData.cpf }),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneE164: true,
        cpf: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
