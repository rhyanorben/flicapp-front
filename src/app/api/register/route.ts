import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Nome, email e senha são obrigatórios" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
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
                name
            }
        });

        if (!signUpResponse) {
            return NextResponse.json(
                { error: "Erro ao criar usuário" },
                { status: 500 }
            );
        }

        const userId = (signUpResponse as any)?.user?.id;

        if (!userId) {
            return NextResponse.json(
                { error: "Usuário criado mas ID não encontrado" },
                { status: 500 }
            );
        }

        let clienteRole = await prisma.role.findFirst({
            where: { name: "CLIENTE" }
        });

        if (!clienteRole) {
            clienteRole = await prisma.role.create({
                data: { name: "CLIENTE" }
            });
        }

        const userRoleAssignment = await prisma.userRoleAssignment.create({
            data: {
                userId: userId,
                roleId: clienteRole.id
            }
        });

        return NextResponse.json(
            {
                success: true,
                message: "Usuário registrado com sucesso",
                user: (signUpResponse as any)?.user
            },
            { status: 201 }
        );

    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Erro ao registrar usuário" },
            { status: 500 }
        );
    }
}

