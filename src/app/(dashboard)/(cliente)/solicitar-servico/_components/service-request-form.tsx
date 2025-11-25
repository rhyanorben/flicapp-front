"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, User, MessageSquare, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSubmitServiceRequest } from "@/lib/queries/services";
import { useUserData } from "@/hooks/use-user-data";
import { ServiceTypeCards } from "./service-type-cards";
import { UrgencyBadges } from "./urgency-badges";
import { SuccessDialog } from "./success-dialog";
import { formatPhoneNumber, validatePhoneNumber } from "@/lib/utils/phone-mask";
import { fetchAddressByCEP, formatCEP, validateCEP } from "@/lib/utils/viacep";
import {
  validateServiceRequest,
  ValidationError,
} from "@/lib/utils/form-validation";

interface ServiceRequestData {
  serviceType: string;
  description: string;
  location: string;
  preferredDate: string;
  preferredTime: string;
  urgency: "baixa" | "normal" | "alta";
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  additionalNotes: string;
}

interface AddressData {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  number: string;
  complement: string;
}

export function ServiceRequestForm() {
  const { userData } = useUserData();
  const submitServiceRequest = useSubmitServiceRequest();

  const [formData, setFormData] = useState<ServiceRequestData>({
    serviceType: "",
    description: "",
    location: "",
    preferredDate: "",
    preferredTime: "",
    urgency: "normal",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    additionalNotes: "",
  });

  const [addressData, setAddressData] = useState<AddressData>({
    cep: "",
    street: "",
    neighborhood: "",
    city: "",
    state: "",
    number: "",
    complement: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successData, setSuccessData] = useState<{
    id: string;
    serviceType: string;
    description: string;
    location: string;
    urgency: string;
    preferredDate?: string;
    preferredTime?: string;
  } | null>(null);
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
  const [showComplement, setShowComplement] = useState(false);

  // Helper function to format phone from E164 format
  const formatPhoneFromE164 = (phoneE164: string | null): string => {
    if (!phoneE164) return "";

    // Remove country code (+55) from phoneE164
    let phoneWithoutCountryCode = phoneE164.replace(/^\+55/, "");

    // Add 9 for mobile numbers if missing (Brazil mobile format)
    // Check if it's a 10-digit number (missing the 9 for mobile)
    if (phoneWithoutCountryCode.length === 10) {
      const ddd = phoneWithoutCountryCode.substring(0, 2);
      const rest = phoneWithoutCountryCode.substring(2);

      // If DDD is valid (11-99) and the rest starts with 4, 5, 6, 7, 8, or 9 (mobile prefixes), add 9
      if (parseInt(ddd) >= 11 && parseInt(ddd) <= 99 && /^[4-9]/.test(rest)) {
        phoneWithoutCountryCode = ddd + "9" + rest;
      }
    }

    return formatPhoneNumber(phoneWithoutCountryCode);
  };

  // Pre-fill user data
  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        contactName: userData.name || "",
        contactEmail: userData.email || "",
        contactPhone: formatPhoneFromE164(userData.phoneE164),
      }));
    }
  }, [userData]);

  // Get today's date for min date
  const today = new Date().toISOString().split("T")[0];

  const handleInputChange = (
    field: keyof ServiceRequestData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field
    setValidationErrors((prev) =>
      prev.filter((error) => error.field !== field)
    );
  };

  const handleAddressChange = (field: keyof AddressData, value: string) => {
    setAddressData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCEPChange = async (cep: string) => {
    const formattedCEP = formatCEP(cep);
    handleAddressChange("cep", formattedCEP);

    if (validateCEP(formattedCEP)) {
      setIsLoadingCEP(true);
      try {
        const address = await fetchAddressByCEP(formattedCEP);
        if (address) {
          setAddressData((prev) => ({
            ...prev,
            street: address.street,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
          }));

          // Update main location field
          const fullAddress = `${address.street}, ${address.neighborhood}, ${address.city} - ${address.state}`;
          handleInputChange("location", fullAddress);
        }
      } catch (error) {
        console.error("CEP lookup failed:", error);
      } finally {
        setIsLoadingCEP(false);
      }
    }
  };

  const handlePhoneChange = (phone: string) => {
    const formatted = formatPhoneNumber(phone);
    handleInputChange("contactPhone", formatted);
  };

  const validateField = (field: keyof ServiceRequestData) => {
    const errors = validateServiceRequest(formData);
    const fieldError = errors.find((error) => error.field === field);

    if (fieldError) {
      setValidationErrors((prev) => [
        ...prev.filter((error) => error.field !== field),
        fieldError,
      ]);
    } else {
      setValidationErrors((prev) =>
        prev.filter((error) => error.field !== field)
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const errors = validateServiceRequest(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Build final location string
    const finalLocation = addressData.number
      ? `${addressData.street}, ${addressData.number}, ${
          addressData.neighborhood
        }, ${addressData.city} - ${addressData.state}${
          addressData.complement ? `, ${addressData.complement}` : ""
        }`
      : formData.location;

    const submitData = {
      ...formData,
      location: finalLocation,
      addressData: addressData.cep ? addressData : undefined,
    };

    submitServiceRequest.mutate(submitData, {
      onSuccess: (data) => {
        setSuccessData({
          id: data.request.id,
          serviceType: submitData.serviceType,
          description: submitData.description,
          location: finalLocation,
          urgency: submitData.urgency,
          preferredDate: submitData.preferredDate,
          preferredTime: submitData.preferredTime,
        });
        setShowSuccessDialog(true);
      },
    });
  };

  const handleNewRequest = () => {
    setShowSuccessDialog(false);
    setSuccessData(null);
    setFormData({
      serviceType: "",
      description: "",
      location: "",
      preferredDate: "",
      preferredTime: "",
      urgency: "normal",
      contactName: userData?.name || "",
      contactPhone: formatPhoneFromE164(userData?.phoneE164 || null),
      contactEmail: userData?.email || "",
      additionalNotes: "",
    });
    setAddressData({
      cep: "",
      street: "",
      neighborhood: "",
      city: "",
      state: "",
      number: "",
      complement: "",
    });
    setValidationErrors([]);
    setShowComplement(false);
  };

  const getFieldError = (field: string) => {
    return validationErrors.find((error) => error.field === field)?.message;
  };

  const isFormValid = () => {
    return (
      formData.serviceType &&
      formData.description.length >= 10 &&
      formData.location &&
      formData.contactName &&
      validatePhoneNumber(formData.contactPhone)
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="grid gap-6">
        {/* Service Details Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />O que você precisa?
            </CardTitle>
            <CardDescription>
              Escolha o tipo de serviço e descreva o que precisa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">Tipo de Serviço *</Label>
              <ServiceTypeCards
                selectedType={formData.serviceType}
                onSelect={(type) => handleInputChange("serviceType", type)}
              />
              {getFieldError("serviceType") && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{getFieldError("serviceType")}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Urgência</Label>
              <UrgencyBadges
                selectedUrgency={formData.urgency}
                onSelect={(urgency) => handleInputChange("urgency", urgency)}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-base font-medium">
                Descrição do Serviço *
              </Label>
              <p className="text-sm text-muted-foreground">
                Descreva o que você precisa (ambiente, tamanho, problema
                específico, marca do equipamento...)
              </p>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                onBlur={() => validateField("description")}
                placeholder="Ex: Preciso de limpeza pós-obra em apartamento de 80m², 3 quartos, área de serviço..."
                className="min-h-[120px] text-base"
                required
              />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {formData.description.length}/300 caracteres
                </span>
                <span className="text-muted-foreground">
                  Ideal: 100-300 caracteres
                </span>
              </div>
              {getFieldError("description") && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{getFieldError("description")}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location & Scheduling Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Onde e quando?
            </CardTitle>
            <CardDescription>
              Onde e quando você gostaria de receber o serviço
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Existing addresses selector */}
            {userData?.addresses && userData.addresses.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Endereços Salvos
                </Label>
                <div className="space-y-2">
                  {userData.addresses.map((address) => (
                    <button
                      key={address.id}
                      type="button"
                      onClick={() => {
                        setAddressData({
                          cep: address.cep || "",
                          street: address.street || "",
                          neighborhood: address.neighborhood || "",
                          city: address.city || "",
                          state: address.state || "",
                          number: address.number || "",
                          complement: address.complement || "",
                        });
                        const fullAddress = `${address.street}, ${address.number}, ${address.neighborhood}, ${address.city} - ${address.state}`;
                        handleInputChange("location", fullAddress);
                      }}
                      className="w-full p-3 text-left border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="font-medium">
                        {address.label || "Endereço sem nome"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {address.street}, {address.number}
                        {address.complement && `, ${address.complement}`}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {address.neighborhood}, {address.city} - {address.state}
                      </div>
                      {address.cep && (
                        <div className="text-sm text-muted-foreground">
                          CEP: {address.cep}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Ou preencha um novo endereço abaixo:
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="cep" className="text-base font-medium">
                  CEP *
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="cep"
                    value={addressData.cep}
                    onChange={(e) => handleCEPChange(e.target.value)}
                    placeholder="00000-000"
                    className="w-32"
                    maxLength={9}
                  />
                  {isLoadingCEP && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                      Buscando...
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Rua</Label>
                  <Input
                    id="street"
                    value={addressData.street}
                    onChange={(e) =>
                      handleAddressChange("street", e.target.value)
                    }
                    placeholder="Nome da rua"
                    disabled={isLoadingCEP}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number" className="text-base font-medium">
                    Número *
                  </Label>
                  <Input
                    id="number"
                    value={addressData.number}
                    onChange={(e) =>
                      handleAddressChange("number", e.target.value)
                    }
                    placeholder="123"
                    className="text-base"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Obrigatório para completar o endereço
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={addressData.neighborhood}
                    onChange={(e) =>
                      handleAddressChange("neighborhood", e.target.value)
                    }
                    placeholder="Nome do bairro"
                    disabled={isLoadingCEP}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={addressData.city}
                    onChange={(e) =>
                      handleAddressChange("city", e.target.value)
                    }
                    placeholder="Nome da cidade"
                    disabled={isLoadingCEP}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasComplement"
                    checked={showComplement}
                    onChange={(e) => setShowComplement(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="hasComplement" className="text-sm">
                    Adicionar complemento (apto, bloco, etc.)
                  </Label>
                </div>
                {showComplement && (
                  <Input
                    value={addressData.complement}
                    onChange={(e) =>
                      handleAddressChange("complement", e.target.value)
                    }
                    placeholder="Apto 101, Bloco A, etc."
                  />
                )}
              </div>

              {getFieldError("location") && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{getFieldError("location")}</span>
                </div>
              )}

              {!addressData.number && addressData.cep && (
                <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                      <AlertCircle className="h-4 w-4" />
                      <span>Informe o número para completar o endereço</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-base font-medium">Agendamento</Label>
                <p className="text-sm text-muted-foreground">
                  O prestador confirmará a disponibilidade
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Data Preferencial</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) =>
                      handleInputChange("preferredDate", e.target.value)
                    }
                    min={today}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Horário Preferencial</Label>
                  <Input
                    id="preferredTime"
                    type="time"
                    value={formData.preferredTime}
                    onChange={(e) =>
                      handleInputChange("preferredTime", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    handleInputChange(
                      "preferredDate",
                      today.toISOString().split("T")[0]
                    );
                  }}
                >
                  Hoje
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    handleInputChange(
                      "preferredDate",
                      tomorrow.toISOString().split("T")[0]
                    );
                  }}
                >
                  Amanhã
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const nextSaturday = new Date();
                    const daysUntilSaturday = (6 - nextSaturday.getDay()) % 7;
                    nextSaturday.setDate(
                      nextSaturday.getDate() + (daysUntilSaturday || 7)
                    );
                    handleInputChange(
                      "preferredDate",
                      nextSaturday.toISOString().split("T")[0]
                    );
                  }}
                >
                  Próximo sábado
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações de Contato
            </CardTitle>
            <CardDescription>
              Como podemos entrar em contato com você
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName" className="text-base font-medium">
                  Nome Completo *
                </Label>
                <Input
                  id="contactName"
                  type="text"
                  value={formData.contactName}
                  onChange={(e) =>
                    handleInputChange("contactName", e.target.value)
                  }
                  onBlur={() => validateField("contactName")}
                  placeholder="Seu nome completo"
                  className="text-base"
                  required
                />
                {getFieldError("contactName") && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{getFieldError("contactName")}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone" className="text-base font-medium">
                  Telefone *
                </Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onBlur={() => validateField("contactPhone")}
                  placeholder="(11) 99999-9999"
                  className="text-base"
                  required
                />
                {getFieldError("contactPhone") && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{getFieldError("contactPhone")}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="text-base font-medium">
                E-mail
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) =>
                  handleInputChange("contactEmail", e.target.value)
                }
                placeholder="seu@email.com"
                className="text-base"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>🔒</span>
              <span>Seus dados são usados apenas para este pedido</span>
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Observações Adicionais
            </CardTitle>
            <CardDescription>
              Alguma informação adicional que considere importante
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.additionalNotes}
              onChange={(e) =>
                handleInputChange("additionalNotes", e.target.value)
              }
              placeholder="Ex: Acesso pelo portão lateral, equipamento no 3º andar, horário comercial apenas..."
              className="min-h-[100px] text-base"
            />
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button">
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={submitServiceRequest.isPending || !isFormValid()}
            className="min-w-[140px]"
          >
            {submitServiceRequest.isPending ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Enviando...
              </div>
            ) : (
              "Solicitar Serviço"
            )}
          </Button>
        </div>
      </form>

      {/* Success Dialog */}
      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        onNewRequest={handleNewRequest}
        requestData={successData || undefined}
      />
    </>
  );
}
