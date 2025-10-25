"use client";

import { useState, useEffect } from "react";
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
import { useProviderRequests } from "@/lib/queries/provider-requests";

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
  const [filteredRequests, setFilteredRequests] = useState<ProviderRequest[]>(
    []
  );
  const [currentFilter, setCurrentFilter] = useState("ALL");
  const router = useRouter();
  const { data: requests, isLoading, error, refetch } = useProviderRequests();

  // Handle 403 redirect
  if (error?.message === "Acesso negado") {
    router.push("/dashboard");
  }

  const filterRequests = (allRequests: ProviderRequest[], filter: string) => {
    if (filter === "ALL") {
      setFilteredRequests(allRequests);
    } else {
      setFilteredRequests(allRequests.filter((req) => req.status === filter));
    }
  };

  // Update filtered requests when requests data changes
  useEffect(() => {
    if (requests) {
      filterRequests(requests, currentFilter);
    }
  }, [requests, currentFilter]);

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    if (requests) {
      filterRequests(requests, filter);
    }
  };

  const handleRequestUpdate = () => {
    refetch();
  };

  const getCounts = () => {
    if (!requests) return { all: 0, pending: 0, approved: 0, rejected: 0 };
    return {
      all: requests.length,
      pending: requests.filter((r) => r.status === "PENDING").length,
      approved: requests.filter((r) => r.status === "APPROVED").length,
      rejected: requests.filter((r) => r.status === "REJECTED").length,
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Solicitações de Prestador</CardTitle>
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
  );
}
