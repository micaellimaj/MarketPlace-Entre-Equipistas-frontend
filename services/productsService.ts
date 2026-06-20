import { api } from './api';
import { Product, CreateProductPayload, UpdateProductPayload } from '@/types/products';

export const productsService = {
  /**
   * Lista TODOS os produtos de todos os usuários da plataforma (GET /products)
   */
  async getAll(): Promise<Product[]> {
    return api.request<Product[]>('/products', {
      method: 'GET',
    });
  },

  /**
   * Lista apenas os produtos do usuário logado (GET /products/me)
   */
  async getMyProducts(): Promise<Product[]> {
    return api.request<Product[]>('/products/me', {
      method: 'GET',
    });
  },

  /**
   * Cria um produto usando FormData para upload múltiplo de imagens (POST /products)
   */
  async create(payload: CreateProductPayload): Promise<Product> {
    const formData = new FormData();
    formData.append('nome', payload.nome);
    formData.append('preco', String(payload.preco));
    formData.append('descricao', payload.descricao);
    formData.append('categoria', payload.categoria);

    if (payload.imagens && payload.imagens.length > 0) {
      payload.imagens.forEach((file) => {
        formData.append('imagens', file);
      });
    }

    return api.request<Product>('/products', {
      method: 'POST',
      body: formData,
      headers: { 'X-Multipart-Request': 'true' },
    });
  },

  /**
   * Atualiza os dados de um produto (PUT /products/:id)
   */
  /**
   * Atualiza um produto usando FormData para upload múltiplo de imagens (PUT /products/:id)
   */
  async update(productData: { 
    id: string; 
    nome: string; 
    descricao: string; 
    preco: number; 
    categoria: string; 
    imagens?: File[] 
  }): Promise<Product> {
    const formData = new FormData();
    formData.append('nome', productData.nome);
    formData.append('preco', String(productData.preco));
    formData.append('descricao', productData.descricao);
    formData.append('categoria', productData.categoria);

    if (productData.imagens && productData.imagens.length > 0) {
      productData.imagens.forEach((file) => {
        formData.append('imagens', file);
      });
    }

    return api.request<Product>(`/products/${productData.id}`, {
      method: 'PUT',
      body: formData,
      headers: { 'X-Multipart-Request': 'true' },
    });
  },
  /**
   * Remove um produto por ID (DELETE /products/:id)
   */
  async delete(id: string): Promise<void> {
    return api.request<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  }
};