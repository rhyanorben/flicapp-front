/**
 * Form validation utilities for service request
 */

export interface ValidationError {
  field: string;
  message: string;
}

export function validateServiceRequest(data: {
  serviceType: string;
  description: string;
  location: string;
  contactName: string;
  contactPhone: string;
  urgency?: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  // Service type validation
  if (!data.serviceType || data.serviceType.trim() === "") {
    errors.push({
      field: "serviceType",
      message: "Selecione um tipo de serviço",
    });
  }

  // Description validation
  if (!data.description || data.description.trim() === "") {
    errors.push({
      field: "description",
      message: "Descrição é obrigatória",
    });
  } else if (data.description.trim().length < 10) {
    errors.push({
      field: "description",
      message: "Descrição deve ter pelo menos 10 caracteres",
    });
  }

  // Location validation
  if (!data.location || data.location.trim() === "") {
    errors.push({
      field: "location",
      message: "Local é obrigatório",
    });
  }

  // Contact name validation
  if (!data.contactName || data.contactName.trim() === "") {
    errors.push({
      field: "contactName",
      message: "Nome é obrigatório",
    });
  }

  // Phone validation
  if (!data.contactPhone || data.contactPhone.trim() === "") {
    errors.push({
      field: "contactPhone",
      message: "Telefone é obrigatório",
    });
  } else {
    const phoneNumbers = data.contactPhone.replace(/\D/g, "");
    if (phoneNumbers.length !== 11) {
      errors.push({
        field: "contactPhone",
        message: "Telefone deve ter 11 dígitos",
      });
    }
  }

  return errors;
}

export function getFieldError(
  errors: ValidationError[],
  field: string
): string | undefined {
  return errors.find((error) => error.field === field)?.message;
}
