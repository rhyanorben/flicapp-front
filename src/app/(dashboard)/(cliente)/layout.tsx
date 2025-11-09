import { auth } from "@/lib/auth";
import { getUserRoles } from "@/lib/role-utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ClienteLayout({
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
  const isCliente = userRoles.includes("CLIENTE");

  if (!isCliente) {
    redirect("/dashboard");
  }

  return <div>{children}</div>;
}
