"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { RequestDetailsDialog } from "./request-details-dialog";

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

interface RequestsTableProps {
  requests: ProviderRequest[];
  onRequestUpdate: () => void;
}

export function RequestsTable({
  requests,
  onRequestUpdate,
}: RequestsTableProps) {
  const [selectedRequest, setSelectedRequest] =
    useState<ProviderRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-300"
          >
            Pendente
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            Aprovada
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-300"
          >
            Rejeitada
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewRequest = (request: ProviderRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedRequest(null);
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Nenhuma solicitação encontrada
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Solicitante</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data da Solicitação</TableHead>
              <TableHead>Data de Revisão</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  {request.user.name}
                </TableCell>
                <TableCell>{request.user.email}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>
                  {new Date(request.createdAt).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  {request.reviewedAt
                    ? new Date(request.reviewedAt).toLocaleDateString("pt-BR")
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewRequest(request)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedRequest && (
        <RequestDetailsDialog
          request={selectedRequest}
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onUpdate={onRequestUpdate}
        />
      )}
    </>
  );
}
