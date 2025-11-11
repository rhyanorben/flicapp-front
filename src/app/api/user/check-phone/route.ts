import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { convertPhoneToE164 } from "@/lib/utils/phone-mask";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "Telefone não fornecido" },
        { status: 400 }
      );
    }

    // Convert phone to E164 format
    let phoneE164: string;
    try {
      phoneE164 = convertPhoneToE164(phone);
      console.log("Phone converted to E164:", phoneE164);
    } catch (error) {
      console.error("Error converting phone to E164:", error);
      return NextResponse.json(
        { error: "Formato de telefone inválido" },
        { status: 400 }
      );
    }

    // Normalize phoneE164: remove +55 to get the base number
    const baseNumber = phoneE164.replace(/^\+55/, "");
    
    // Generate possible variations to check:
    // 1. The exact E164 format
    // 2. If it's 11 digits (with 9), also check without the 9 (10 digits)
    // 3. If it's 10 digits (without 9), also check with the 9 (11 digits)
    const variations: string[] = [phoneE164];
    
    if (baseNumber.length === 11) {
      // Has 11 digits (with 9), also check without 9
      const ddd = baseNumber.substring(0, 2);
      const rest = baseNumber.substring(3); // Skip the 9
      variations.push(`+55${ddd}${rest}`);
    } else if (baseNumber.length === 10) {
      // Has 10 digits (without 9), also check with 9
      const ddd = baseNumber.substring(0, 2);
      const rest = baseNumber.substring(2);
      // Only add 9 if it looks like a mobile number (starts with 4-9)
      if (/^[4-9]/.test(rest)) {
        variations.push(`+55${ddd}9${rest}`);
      }
    }

    console.log("Checking phone variations:", variations);

    // Check if phone exists in database (excluding current user's phone)
    // Check all variations
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: variations.map(variation => ({
          phoneE164: variation,
        })),
        NOT: {
          id: session.user.id,
        },
      },
      select: {
        id: true,
        phoneE164: true,
      },
    });

    console.log("Phone check result:", {
      phoneE164,
      variations,
      exists: !!existingUser,
      foundUser: existingUser,
    });

    return NextResponse.json({
      exists: !!existingUser,
      phoneE164, // Return the converted phone for debugging
    });
  } catch (error) {
    console.error("Error checking phone:", error);
    return NextResponse.json(
      { error: "Erro ao verificar telefone" },
      { status: 500 }
    );
  }
}

