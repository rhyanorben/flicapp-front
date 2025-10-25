"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardHeader from "./dashboard-header";
import { generateBreadcrumbs } from "@/lib/breadcrumb-utils";

export default function DashboardHeaderWrapper() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const breadcrumbs = generateBreadcrumbs(pathname);

  if (!isClient) {
    return <DashboardHeader breadcrumbs={[]} />;
  }

  return <DashboardHeader breadcrumbs={breadcrumbs} />;
}
