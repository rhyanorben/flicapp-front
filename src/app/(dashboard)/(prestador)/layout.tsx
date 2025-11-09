import { auth } from "@/lib/auth";
import { getUserRoles } from "@/lib/role-utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function PrestadorLayout({
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
  const isPrestador = userRoles.includes("PRESTADOR");

  if (!isPrestador) {
    redirect("/dashboard");
  }

  return <div>{children}</div>;
}
