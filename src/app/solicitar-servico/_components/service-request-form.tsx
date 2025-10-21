"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, User, Phone, Mail, MessageSquare } from "lucide-react"

interface ServiceRequestData {
  serviceType: string
  description: string
  location: string
  preferredDate: string
  preferredTime: string
  urgency: string
  contactName: string
  contactPhone: string
  contactEmail: string
  additionalNotes: string
}

export function ServiceRequestForm() {
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
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof ServiceRequestData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Aqui você implementaria a lógica para enviar os dados
      console.log("Dados do serviço:", formData)
      
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Resetar formulário após sucesso
      setFormData({
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
      })
      
      alert("Solicitação enviada com sucesso!")
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error)
      alert("Erro ao enviar solicitação. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Detalhes do Serviço
          </CardTitle>
          <CardDescription>
            Informe os detalhes sobre o serviço que você precisa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceType">Tipo de Serviço *</Label>
              <select
                id="serviceType"
                value={formData.serviceType}
                onChange={(e) => handleInputChange("serviceType", e.target.value)}
                className="w-full p-2 border border-input bg-background rounded-md"
                required
              >
                <option value="">Selecione um tipo de serviço</option>
                <option value="limpeza">Limpeza</option>
                <option value="manutencao">Manutenção</option>
                <option value="reparo">Reparo</option>
                <option value="instalacao">Instalação</option>
                <option value="consultoria">Consultoria</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="urgency">Urgência *</Label>
              <select
                id="urgency"
                value={formData.urgency}
                onChange={(e) => handleInputChange("urgency", e.target.value)}
                className="w-full p-2 border border-input bg-background rounded-md"
                required
              >
                <option value="baixa">Baixa</option>
                <option value="normal">Normal</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição do Serviço *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descreva detalhadamente o serviço que você precisa..."
              className="w-full p-2 border border-input bg-background rounded-md min-h-[100px] resize-none"
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Localização e Agendamento
          </CardTitle>
          <CardDescription>
            Onde e quando você gostaria de receber o serviço
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Local *</Label>
            <Input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Endereço completo onde o serviço será realizado"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredDate">Data Preferencial</Label>
              <Input
                id="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={(e) => handleInputChange("preferredDate", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preferredTime">Horário Preferencial</Label>
              <Input
                id="preferredTime"
                type="time"
                value={formData.preferredTime}
                onChange={(e) => handleInputChange("preferredTime", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

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
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Nome Completo *</Label>
              <Input
                id="contactName"
                type="text"
                value={formData.contactName}
                onChange={(e) => handleInputChange("contactName", e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Telefone *</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">E-mail</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange("contactEmail", e.target.value)}
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Observações Adicionais</Label>
            <textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
              placeholder="Alguma informação adicional que considere importante..."
              className="w-full p-2 border border-input bg-background rounded-md min-h-[80px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button">
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !formData.serviceType || !formData.description || !formData.location || !formData.contactName || !formData.contactPhone}
        >
          {isSubmitting ? "Enviando..." : "Solicitar Serviço"}
        </Button>
      </div>
    </div>
  )
}
