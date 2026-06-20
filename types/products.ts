// Enums exatos do seu schema.prisma
export type ProductCategory = 
  | 'COMIDA'
  | 'ROUPAS'
  | 'COSMETICOS'
  | 'ELETRONICOS'
  | 'SAUDE'
  | 'CASA'
  | 'BRINQUEDOS'
  | 'LIVROS'
  | 'ESPORTES'
  | 'AUTOMOTIVO'
  | 'OUTROS';

export interface ProductOwner {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

export interface Product {
  id: string;
  nome: string;
  preco: number;
  descricao: string;
  imagens: string[];
  categoria: ProductCategory;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: ProductOwner; // Preenchido no include do listAll
}

export interface CreateProductPayload {
  nome: string;
  preco: number;
  descricao: string;
  categoria: ProductCategory;
  imagens?: File[];
}

export interface UpdateProductPayload {
  id: string;
  nome?: string;
  preco?: number;
  descricao?: string;
  categoria?: ProductCategory;
  // Caso seu controller mude para aceitar arquivos no futuro, o tipo já está pronto:
  imagens?: File[]; 
}