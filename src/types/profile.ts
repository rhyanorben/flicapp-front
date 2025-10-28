export interface ProfileData {
  id: string;
  name: string;
  email: string | null;
  phoneE164: string | null;
  cpf: string | null;
  updatedAt: string;
}

export interface AddressData {
  id: string;
  label: string | null;
  cep: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  lat: number | null;
  lon: number | null;
  createdAt: string;
}

export interface CreateAddressData {
  label: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  lat?: number;
  lon?: number;
}

export interface UpdateProfileData {
  name: string;
  phoneE164: string;
  cpf?: string;
}

export interface UpdateAddressData extends CreateAddressData {}

export interface ProfileFormData {
  name: string;
  phone: string;
  cpf: string;
}

export interface AddressFormData {
  label: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}
