import { Product } from './products';

export type UserStatus = 'ATIVO' | 'INATIVO';

export interface Address {
  id: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  cpf: string;
  nome: string;
  telefone: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  addresses?: Address[];
  products?: Product[];
}

export interface UpdateUserAdminPayload {
  nome?: string;
  telefone?: string;
  status?: UserStatus;
  addresses?: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[];
  products?: Omit<Product, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'imagens'>[];
}