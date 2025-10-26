"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RequestsTable } from "./_components/requests-table";
import { RejectionDialog } from "./_components/rejection-dialog";
import {
  useProviderRequests,
  useUpdateProviderRequest,
} from "@/lib/queries/provider-requests";

function SolicitacoesPrestadorTable() {
  const router = useRouter();
  const { data: requests, isLoading, error, refetch } = useProviderRequests();
  const updateProviderRequest = useUpdateProviderRequest();
  const [rejectionDialog, setRejectionDialog] = useState<{
    isOpen: boolean;
    requestId: string | null;
  }>({ isOpen: false, requestId: null });

  // Handle 403 redirect
  if (error?.message === "Acesso negado") {
    router.push("/dashboard");
  }

  const handleRequestUpdate = () => {
    refetch();
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      await updateProviderRequest.mutateAsync({
        id: requestId,
        action: "approve",
      });
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleRejectRequest = (requestId: string) => {
    setRejectionDialog({ isOpen: true, requestId });
  };

  const handleConfirmRejection = async (reason: string) => {
    if (rejectionDialog.requestId) {
      try {
        await updateProviderRequest.mutateAsync({
          id: rejectionDialog.requestId,
          action: "reject",
          rejectionReason: reason,
        });
        setRejectionDialog({ isOpen: false, requestId: null });
      } catch (error) {
        console.error("Error rejecting request:", error);
      }
    }
  };

  const handleCloseRejectionDialog = () => {
    setRejectionDialog({ isOpen: false, requestId: null });
  };

  if (isLoading) {
    return <SolicitacoesPrestadorTableSkeleton />;
  }

  return (
    <>
      <RequestsTable
        requests={requests || []}
        onRequestUpdate={handleRequestUpdate}
        onApproveRequest={handleApproveRequest}
        onRejectRequest={handleRejectRequest}
        isUpdating={updateProviderRequest.isPending}
      />
      <RejectionDialog
        isOpen={rejectionDialog.isOpen}
        onClose={handleCloseRejectionDialog}
        onConfirm={handleConfirmRejection}
        isLoading={updateProviderRequest.isPending}
      />
    </>
  );
}

function SolicitacoesPrestadorTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-full bg-muted animate-pulse rounded" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 w-full bg-muted animate-pulse rounded" />
        ))}
      </div>
    </div>
  );
}

export default function SolicitacoesPrestadorPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Solicitações de Prestador</h1>
        <p className="text-muted-foreground">
          Gerencie as solicitações de usuários que desejam se tornar prestadores
          de serviços
        </p>
      </div>
      <SolicitacoesPrestadorTable />
    </div>
  );
}
