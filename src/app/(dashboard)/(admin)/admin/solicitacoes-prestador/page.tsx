"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { RequestsFilters } from "./_components/requests-filters";
import { RequestsTable } from "./_components/requests-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface User {
  id: string;
  name: string;
  email: string;
}

interface ProviderRequest {
  id: string;
  userId: string;
  user: User;
  description: string;
  experience: string;
  phone: string;
  address: string;
  documentNumber: string;
  portfolioLinks: string | null;
  status: string;
  reviewedBy: string | null;
  reviewedByUser: User | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function SolicitacoesPrestadorPage() {
  const [requests, setRequests] = useState<ProviderRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ProviderRequest[]>(
    []
  );
  const [currentFilter, setCurrentFilter] = useState("ALL");
  const [isFetchingRequests, setIsFetchingRequests] = useState(true);
  const router = useRouter();

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/provider-request/admin");
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
        filterRequests(data, currentFilter);
      } else if (response.status === 403) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setIsFetchingRequests(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [router]);

  const filterRequests = (allRequests: ProviderRequest[], filter: string) => {
    if (filter === "ALL") {
      setFilteredRequests(allRequests);
    } else {
      setFilteredRequests(allRequests.filter((req) => req.status === filter));
    }
  };

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    filterRequests(requests, filter);
  };

  const handleRequestUpdate = () => {
    fetchRequests();
  };

  const getCounts = () => {
    return {
      all: requests.length,
      pending: requests.filter((r) => r.status === "PENDING").length,
      approved: requests.filter((r) => r.status === "APPROVED").length,
      rejected: requests.filter((r) => r.status === "REJECTED").length,
    };
  };

  if (isFetchingRequests) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">FlicApp</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Administração</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Solicitações de Prestador</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Solicitações de Prestador
            </CardTitle>
            <CardDescription>
              Gerencie as solicitações de usuários que desejam se tornar
              prestadores de serviços
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RequestsFilters
              currentFilter={currentFilter}
              onFilterChange={handleFilterChange}
              counts={getCounts()}
            />
            <RequestsTable
              requests={filteredRequests}
              onRequestUpdate={handleRequestUpdate}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
