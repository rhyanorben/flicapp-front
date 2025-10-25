/**
 * ViaCEP API integration for Brazilian address lookup
 */

export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface AddressData {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  number?: string;
  complement?: string;
}

export async function fetchAddressByCEP(
  cep: string
): Promise<AddressData | null> {
  try {
    // Clean CEP (remove non-numeric characters)
    const cleanCEP = cep.replace(/\D/g, "");

    // Validate CEP format (8 digits)
    if (cleanCEP.length !== 8) {
      throw new Error("CEP deve ter 8 dígitos");
    }

    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);

    if (!response.ok) {
      throw new Error("Erro ao consultar CEP");
    }

    const data: ViaCEPResponse = await response.json();

    if (data.erro) {
      throw new Error("CEP não encontrado");
    }

    return {
      cep: data.cep,
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
    };
  } catch (error) {
    console.error("ViaCEP error:", error);
    throw error;
  }
}

export function formatCEP(cep: string): string {
  const numbers = cep.replace(/\D/g, "");
  if (numbers.length <= 5) {
    return numbers;
  }
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
}

export function validateCEP(cep: string): boolean {
  const numbers = cep.replace(/\D/g, "");
  return numbers.length === 8;
}
