import { NextRequest, NextResponse } from "next/server";
import { getUserRoles } from "@/lib/role-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID é obrigatório" },
        { status: 400 }
      );
    }

    const roles = await getUserRoles(userId);
    
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Erro ao buscar roles do usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
