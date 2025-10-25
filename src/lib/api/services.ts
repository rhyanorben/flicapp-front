export interface ServiceRequestData {
  serviceType: string;
  description: string;
  location: string;
  preferredDate: string;
  preferredTime: string;
  urgency: "low" | "normal" | "high";
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  additionalNotes: string;
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
  // TODO: Implement when API endpoint is created
  // For now, simulate the API call
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    message: "Solicitação enviada com sucesso!",
    request: {
      id: "temp-id",
      serviceType: data.serviceType,
      description: data.description,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    },
  };
}
