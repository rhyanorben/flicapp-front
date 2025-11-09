export interface ServiceRequestData {
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
  addressData?: {
    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    number: string;
    complement: string;
  };
}

export interface ServiceRequestResponse {
  message: string;
  request: {
    id: string;
    serviceType: string;
    description: string;
    status: string;
    createdAt: string;
  };
}

export async function submitServiceRequest(
  data: ServiceRequestData
): Promise<ServiceRequestResponse> {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to submit service request");
  }

  return response.json();
}
