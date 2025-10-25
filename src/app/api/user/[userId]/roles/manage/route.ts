import { NextRequest, NextResponse } from "next/server";
import { assignRoleToUser, removeRoleFromUser } from "@/lib/role-utils";
import { USER_ROLES } from "@/types/user";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { roleName, action } = await request.json();

    if (!userId || !roleName) {
      return NextResponse.json(
        { error: "User ID e Role Name são obrigatórios" },
        { status: 400 }
      );
    }

    if (!Object.values(USER_ROLES).includes(roleName)) {
      return NextResponse.json({ error: "Role inválida" }, { status: 400 });
    }

    let result;

    if (action === "assign") {
      result = await assignRoleToUser(userId, roleName);
    } else if (action === "remove") {
      result = await removeRoleFromUser(userId, roleName);
    } else {
      return NextResponse.json(
        { error: "Ação deve ser 'assign' ou 'remove'" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Erro ao gerenciar role do usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
