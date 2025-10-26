"use client";

import { useState } from "react";
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
  ExternalLink,
  Calendar,
  Hash,
  Building,
} from "lucide-react";
import { useUpdateProviderRequest } from "@/lib/queries/provider-requests";
import { RejectionDialog } from "./rejection-dialog";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
}

interface ServiceSelection {
  serviceType: string;
  experienceLevel: string;
  customService?: string;
}

interface PortfolioLink {
  url: string;
  title: string;
}

interface ProviderRequest {
  id: string;
  userId: string;
  user: User;
  services?: ServiceSelection[];
  description: string;
  experience: string;
  phone: string;
  cep?: string;
  address: string;
  documentNumber: string;
  portfolioLinks?: string | null;
  portfolioLinksJson?: PortfolioLink[] | null;
  status: string;
  rejectionReason?: string;
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
  const [rejectionDialog, setRejectionDialog] = useState<{
    isOpen: boolean;
  }>({ isOpen: false });

  const handleApprove = () => {
    updateProviderRequest.mutate(
      { id: request.id, action: "approve" },
      {
        onSuccess: () => {
          onClose();
          onUpdate();
        },
      }
    );
  };

  const handleReject = () => {
    setRejectionDialog({ isOpen: true });
  };

  const handleConfirmRejection = async (reason: string) => {
    try {
      await updateProviderRequest.mutateAsync({
        id: request.id,
        action: "reject",
        rejectionReason: reason,
      });
      setRejectionDialog({ isOpen: false });
      onClose();
      onUpdate();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const handleCloseRejectionDialog = () => {
    setRejectionDialog({ isOpen: false });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800"
          >
            Pendente
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800"
          >
            Aprovada
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800"
          >
            Rejeitada
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getExperienceLevelBadge = (level: string) => {
    const levels = {
      iniciante: {
        label: "Iniciante",
        color:
          "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800",
      },
      intermediario: {
        label: "Intermediário",
        color:
          "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-800",
      },
      avancado: {
        label: "Avançado",
        color:
          "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-800",
      },
      especialista: {
        label: "Especialista",
        color:
          "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-800",
      },
    };

    const levelInfo = levels[level as keyof typeof levels] || {
      label: level,
      color:
        "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/20 dark:text-gray-400 dark:border-gray-800",
    };

    return (
      <Badge variant="outline" className={levelInfo.color}>
        {levelInfo.label}
      </Badge>
    );
  };

  const getServiceLabel = (serviceType: string) => {
    const serviceLabels: Record<string, string> = {
      eletricista: "Eletricista",
      encanador: "Encanador",
      "limpeza-residencial": "Limpeza Residencial",
      "suporte-de-informatica": "Suporte de Informática",
      "montador-de-moveis": "Montador de Móveis",
      chaveiro: "Chaveiro",
      pintor: "Pintor",
      "pedreiro-reforma": "Pedreiro/Reforma",
      marceneiro: "Marceneiro",
      jardinagem: "Jardinagem",
      piscineiro: "Piscineiro",
      dedetizacao: "Dedetização",
      gesseiro: "Gesseiro",
      serralheiro: "Serralheiro",
      vidraceiro: "Vidraceiro",
      "instalador-ar-condicionado": "Instalador de Ar Condicionado",
      "manutencao-eletrodomesticos": "Manutenção de Eletrodomésticos",
      "mecanico-automotivo": "Mecânico Automotivo",
      "funilaria-automotiva": "Funilaria Automotiva",
      "transporte-frete": "Transporte/Frete",
      "mudanca-carretos": "Mudança/Carretos",
      "cuidador-idosos": "Cuidador de Idosos",
      baba: "Baba",
      "professor-particular": "Professor Particular",
      "personal-trainer": "Personal Trainer",
      "fotografo-filmagem": "Fotógrafo/Filmagem",
      "designer-grafico": "Designer Gráfico",
      cabeleireiro: "Cabeleireiro",
      "manicure-pedicure": "Manicure/Pedicure",
      maquiagem: "Maquiagem",
      buffet: "Buffet",
      "dj-som": "DJ/Som",
      "decoracao-eventos": "Decoração de Eventos",
      outros: "Outros",
    };

    return serviceLabels[serviceType] || serviceType;
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

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                Status da Solicitação:
              </span>
            </div>
            {getStatusBadge(request.status)}
          </div>

          {/* Rejection Reason */}
          {request.status === "REJECTED" && request.rejectionReason && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">
                    Motivo da Rejeição:
                  </span>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {request.rejectionReason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* User Information */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Informações do Solicitante
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">
                  Nome Completo
                </span>
                <p className="font-medium">{request.user.name}</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Email</span>
                <p className="font-medium">{request.user.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Services Information */}
          {request.services && request.services.length > 0 && (
            <>
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2 text-lg">
                  <Building className="h-5 w-5" />
                  Serviços Oferecidos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {request.services.map((service, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">
                          {getServiceLabel(service.serviceType)}
                        </h4>
                        {getExperienceLevelBadge(service.experienceLevel)}
                      </div>
                      {service.customService && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">
                            Serviço personalizado:
                          </span>{" "}
                          {service.customService}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2 text-lg">
              <Phone className="h-5 w-5" />
              Informações de Contato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Telefone</span>
                <p className="font-medium">{request.phone}</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">CPF/CNPJ</span>
                <p className="font-medium">{request.documentNumber}</p>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Endereço
              </span>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="font-medium">{request.address}</p>
                {request.cep && (
                  <p className="text-sm text-muted-foreground mt-1">
                    CEP: {request.cep}
                  </p>
                )}
              </div>
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
          {(request.portfolioLinksJson &&
            request.portfolioLinksJson.length > 0) ||
          request.portfolioLinks ? (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2 text-lg">
                  <Link2 className="h-5 w-5" />
                  Links de Portfólio
                </h3>

                {/* New structured portfolio links */}
                {request.portfolioLinksJson &&
                request.portfolioLinksJson.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {request.portfolioLinksJson.map((link, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{link.title}</h4>
                          <Link
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </div>
                        <p className="text-sm text-muted-foreground break-all">
                          {link.url}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Legacy portfolio links */
                  request.portfolioLinks && (
                    <div className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">
                      {request.portfolioLinks.split("\n").map((link, index) => {
                        const trimmedLink = link.trim();
                        const isValidUrl =
                          trimmedLink &&
                          (trimmedLink.startsWith("http://") ||
                            trimmedLink.startsWith("https://"));

                        return (
                          trimmedLink &&
                          isValidUrl && (
                            <div key={index} className="mb-2">
                              <Link
                                href={trimmedLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline break-all flex items-center gap-1"
                              >
                                {trimmedLink}
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </div>
                          )
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            </>
          ) : null}

          <Separator />

          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5" />
              Informações do Sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Data da Solicitação
                  </span>
                </div>
                <p className="text-sm">
                  {new Date(request.createdAt).toLocaleString("pt-BR")}
                </p>
              </div>

              {request.reviewedAt && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Data de Revisão</span>
                  </div>
                  <p className="text-sm">
                    {new Date(request.reviewedAt).toLocaleString("pt-BR")}
                  </p>
                </div>
              )}

              {request.reviewedByUser && (
                <div className="md:col-span-2 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Revisado por</span>
                  </div>
                  <p className="text-sm">
                    {request.reviewedByUser.name} (
                    {request.reviewedByUser.email})
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          {request.status === "PENDING" ? (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={updateProviderRequest.isPending}
                className="flex-1 sm:flex-none"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejeitar
              </Button>
              <Button
                onClick={handleApprove}
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
      <RejectionDialog
        isOpen={rejectionDialog.isOpen}
        onClose={handleCloseRejectionDialog}
        onConfirm={handleConfirmRejection}
        isLoading={updateProviderRequest.isPending}
      />
    </Dialog>
  );
}
