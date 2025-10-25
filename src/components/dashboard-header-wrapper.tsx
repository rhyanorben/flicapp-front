"use client";

import { usePathname } from "next/navigation";
import DashboardHeader from "./dashboard-header";
import { generateBreadcrumbs } from "@/lib/breadcrumb-utils";

export default function DashboardHeaderWrapper() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return <DashboardHeader breadcrumbs={breadcrumbs} />;
}
