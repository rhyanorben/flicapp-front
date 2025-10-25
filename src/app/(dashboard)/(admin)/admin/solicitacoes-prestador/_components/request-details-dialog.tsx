"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  User,
  Phone,
  MapPin,
  FileText,
  Briefcase,
  Link2,
} from "lucide-react";
import { useUpdateProviderRequest } from "@/lib/queries/provider-requests";

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

interface RequestDetailsDialogProps {
  request: ProviderRequest;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function RequestDetailsDialog({
  request,
  isOpen,
  onClose,
  onUpdate,
}: RequestDetailsDialogProps) {
  const updateProviderRequest = useUpdateProviderRequest();

  const handleAction = (action: "approve" | "reject") => {
    updateProviderRequest.mutate(
      { id: request.id, action },
      {
        onSuccess: () => {
          onClose();
          onUpdate();
        },
      }
    );
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Solicitação</DialogTitle>
          <DialogDescription>
            Revise as informações e aprove ou rejeite a solicitação
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            {getStatusBadge(request.status)}
          </div>

          <Separator />

          {/* User Information */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Informações do Solicitante
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Nome:</span>
                <p className="font-medium">{request.user.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium">{request.user.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Informações de Contato
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Telefone:</span>
                <p className="font-medium">{request.phone}</p>
              </div>
              <div>
                <span className="text-muted-foreground">CPF/CNPJ:</span>
                <p className="font-medium">{request.documentNumber}</p>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Endereço:
              </span>
              <p className="font-medium">{request.address}</p>
            </div>
          </div>

          <Separator />

          {/* Service Description */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Descrição dos Serviços
            </h3>
            <p className="text-sm whitespace-pre-wrap">{request.description}</p>
          </div>

          <Separator />

          {/* Experience */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Experiência Profissional
            </h3>
            <p className="text-sm whitespace-pre-wrap">{request.experience}</p>
          </div>

          {/* Portfolio Links */}
          {request.portfolioLinks && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  Links de Portfólio
                </h3>
                <div className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">
                  {request.portfolioLinks.split("\n").map(
                    (link, index) =>
                      link.trim() && (
                        <div key={index}>
                          <a
                            href={link.trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {link.trim()}
                          </a>
                        </div>
                      )
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div>
              <span>Data da Solicitação:</span>
              <p>{new Date(request.createdAt).toLocaleString("pt-BR")}</p>
            </div>
            {request.reviewedAt && (
              <div>
                <span>Data de Revisão:</span>
                <p>{new Date(request.reviewedAt).toLocaleString("pt-BR")}</p>
              </div>
            )}
            {request.reviewedByUser && (
              <div className="col-span-2">
                <span>Revisado por:</span>
                <p>
                  {request.reviewedByUser.name} ({request.reviewedByUser.email})
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          {request.status === "PENDING" ? (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="destructive"
                onClick={() => handleAction("reject")}
                disabled={updateProviderRequest.isPending}
                className="flex-1 sm:flex-none"
              >
                {updateProviderRequest.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeitar
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleAction("approve")}
                disabled={updateProviderRequest.isPending}
                className="flex-1 sm:flex-none"
              >
                {updateProviderRequest.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Aprovar
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
