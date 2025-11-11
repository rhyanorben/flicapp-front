import { auth } from "@/lib/auth";
import { getUserRoles } from "@/lib/role-utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function TornarPrestadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/dashboard");
  }

  const userId = session.user.id;
  const userRoles = await getUserRoles(userId);
  const isProvider = userRoles.includes("PRESTADOR");

  // Se já é prestador, redirecionar para dashboard
  if (isProvider) {
    redirect("/dashboard");
  }

  return <div>{children}</div>;
}
