"use client";

import { useState, useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const MIN_CHARACTERS = 20;
const MIN_WORDS = 3;

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

function validateDescription(text: string): ValidationResult {
  const errors: string[] = [];
  const trimmed = text.trim();

  // Verificar se está vazio
  if (trimmed.length === 0) {
    return { isValid: false, errors: [] };
  }

  // Verificar caracteres mínimos
  if (trimmed.length < MIN_CHARACTERS) {
    errors.push(`A descrição deve ter pelo menos ${MIN_CHARACTERS} caracteres`);
  }

  // Verificar palavras mínimas
  const words = trimmed.split(/\s+/).filter((w) => w.length > 0);
  const uniqueWords = new Set(words.map((w) => w.toLowerCase()));

  if (words.length < MIN_WORDS) {
    errors.push(`A descrição deve ter pelo menos ${MIN_WORDS} palavras`);
  }

  // Detectar letras repetidas (ex: "aaaaaaa", "bbbbbb")
  const repeatedCharPattern = /(.)\1{4,}/;
  if (repeatedCharPattern.test(trimmed)) {
    errors.push(
      "A descrição contém muitas letras repetidas. Por favor, descreva o serviço de forma clara"
    );
  }

  // Detectar palavras repetidas em excesso (mais de 50% das palavras são repetidas)
  if (words.length > 0) {
    const wordCounts = new Map<string, number>();
    words.forEach((word) => {
      const lower = word.toLowerCase();
      wordCounts.set(lower, (wordCounts.get(lower) || 0) + 1);
    });

    const maxRepetitions = Math.max(...Array.from(wordCounts.values()));
    const repetitionRatio = maxRepetitions / words.length;

    if (repetitionRatio > 0.5 && words.length > 2) {
      errors.push(
        "A descrição contém muitas palavras repetidas. Por favor, seja mais específico"
      );
    }
  }

  // Verificar se tem poucas palavras únicas (menos de 60% de palavras únicas)
  if (words.length > 0) {
    const uniqueRatio = uniqueWords.size / words.length;
    if (uniqueRatio < 0.6 && words.length >= 5) {
      errors.push(
        "A descrição precisa ter mais palavras diferentes. Seja mais detalhado sobre o serviço"
      );
    }
  }

  // Verificar se é apenas espaços ou caracteres especiais
  const hasLetters = /[a-zA-ZÀ-ÿ]/.test(trimmed);
  if (!hasLetters) {
    errors.push(
      "A descrição deve conter letras. Por favor, descreva o serviço em texto"
    );
  }

  // Verificar se tem muito poucos caracteres únicos (menos de 40% de caracteres únicos)
  if (trimmed.length > 0) {
    const uniqueChars = new Set(trimmed.toLowerCase().replace(/\s/g, ""));
    const uniqueCharRatio =
      uniqueChars.size / trimmed.replace(/\s/g, "").length;
    if (uniqueCharRatio < 0.4 && trimmed.length > 10) {
      errors.push(
        "A descrição parece ter muitos caracteres repetidos. Por favor, seja mais descritivo"
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function WhatsAppServiceRequest() {
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Obter número do WhatsApp da variável de ambiente
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999";

  // Validação em tempo real
  const validation = useMemo(
    () => validateDescription(description),
    [description]
  );

  // Gerar link do WhatsApp com o texto codificado
  const generateWhatsAppLink = (text: string) => {
    if (!text.trim()) return "";
    const encodedText = encodeURIComponent(text);
    return `https://wa.me/${whatsappNumber}?text=${encodedText}`;
  };

  const whatsappLink = generateWhatsAppLink(description);
  const hasContent = description.trim().length > 0;
  const canGenerate = hasContent && validation.isValid;

  const handleGenerateLink = () => {
    if (canGenerate) {
      setIsModalOpen(true);
    } else if (hasContent && !validation.isValid) {
      toast({
        title: "Descrição inválida",
        description:
          validation.errors[0] || "Por favor, verifique a descrição do serviço",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(whatsappLink);
      setCopied(true);
      toast({
        title: "Link copiado!",
        description:
          "O link do WhatsApp foi copiado para a área de transferência.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Descreva o serviço que você precisa
          </CardTitle>
          <CardDescription>
            Digite a descrição do serviço e gere um link do WhatsApp para entrar
            em contato
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label
              htmlFor="service-description"
              className="text-base font-medium"
            >
              Descrição do Serviço
            </Label>
            <Textarea
              id="service-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Preciso de limpeza pós-obra em apartamento de 80m², 3 quartos, área de serviço..."
              className={cn(
                "min-h-[200px] text-base",
                hasContent &&
                  !validation.isValid &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p
                  className={cn(
                    "text-sm",
                    description.length < MIN_CHARACTERS
                      ? "text-muted-foreground"
                      : validation.isValid
                      ? "text-green-600 dark:text-green-400"
                      : "text-destructive"
                  )}
                >
                  {description.length} / {MIN_CHARACTERS} caracteres mínimos
                </p>
                {hasContent && validation.isValid && (
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    ✓ Descrição válida
                  </span>
                )}
              </div>
              {hasContent && !validation.isValid && (
                <div className="space-y-1 pt-1">
                  {validation.errors.map((error, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-sm text-destructive"
                    >
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {hasContent && (
            <div className="flex justify-end">
              <Button
                onClick={handleGenerateLink}
                className="min-w-[180px]"
                disabled={!canGenerate}
              >
                Gerar Link do WhatsApp
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Link do WhatsApp Gerado
            </DialogTitle>
            <DialogDescription>
              Use o link ou escaneie o QR code para abrir o WhatsApp com sua
              mensagem
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-base font-medium">Link do WhatsApp</Label>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-md border">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-sm text-primary hover:underline flex items-center gap-2"
                >
                  Abrir no WhatsApp
                  <ExternalLink className="h-4 w-4" />
                </a>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  className="flex-shrink-0"
                  title="Copiar link"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">QR Code</Label>
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-lg border inline-block">
                  <QRCodeSVG
                    value={whatsappLink}
                    size={200}
                    level="M"
                    includeMargin={false}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Escaneie o QR code com seu celular para abrir o WhatsApp
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
