export interface Address {
  id: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressPayload {
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento?: string;
}

export interface UpdateAddressPayload {
  cep?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  city?: string;
  estado?: string;
  complemento?: string;
}