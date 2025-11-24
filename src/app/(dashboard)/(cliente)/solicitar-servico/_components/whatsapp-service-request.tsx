"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageSquare, ExternalLink, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function WhatsAppServiceRequest() {
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Obter número do WhatsApp da variável de ambiente
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999";
  
  // Gerar link do WhatsApp com o texto codificado
  const generateWhatsAppLink = (text: string) => {
    if (!text.trim()) return "";
    const encodedText = encodeURIComponent(text);
    return `https://wa.me/${whatsappNumber}?text=${encodedText}`;
  };

  const whatsappLink = generateWhatsAppLink(description);
  const hasContent = description.trim().length > 0;

  const handleGenerateLink = () => {
    if (hasContent) {
      setIsModalOpen(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(whatsappLink);
      setCopied(true);
      toast({
        title: "Link copiado!",
        description: "O link do WhatsApp foi copiado para a área de transferência.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
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
            Digite a descrição do serviço e gere um link do WhatsApp para entrar em contato
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="service-description" className="text-base font-medium">
              Descrição do Serviço
            </Label>
            <Textarea
              id="service-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Preciso de limpeza pós-obra em apartamento de 80m², 3 quartos, área de serviço..."
              className="min-h-[200px] text-base"
            />
            <p className="text-sm text-muted-foreground">
              {description.length} caracteres
            </p>
          </div>

          {hasContent && (
            <div className="flex justify-end">
              <Button onClick={handleGenerateLink} className="min-w-[180px]">
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
              Use o link ou escaneie o QR code para abrir o WhatsApp com sua mensagem
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

