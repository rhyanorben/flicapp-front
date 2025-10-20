import { PrismaClient } from "@/app/generated/prisma";
// @ts-expect-error - better-auth types issue
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession } from "better-auth/plugins/custom-session";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    plugins: [
        customSession(async (session) => {
            try {
                const userId = session?.user?.id;
                if (!userId) return session;
                
                const userRoles = await prisma.userRoleAssignment.findMany({
                    where: { userId },
                    include: { role: true },
                });
                
                if (userRoles.length > 0 && session?.user) {
                    const primaryRole = userRoles[0].role.name;
                    (session.user as { role?: string }).role = String(primaryRole);
                }
            } catch (_) {
            }
            return session;
        })
    ],
    callbacks: {
      async session({ session, user }: { session: { user?: { id?: string; role?: string } }; user: { role?: string } }) {
        if (user?.role && session?.user) {
          session.user.role = user.role;
        }
        return session as unknown as { user?: { id?: string; role?: string } };
      },
    },
});