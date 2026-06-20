import { api } from './api';
import { Address, CreateAddressPayload, UpdateAddressPayload } from '@/types/addresses';

export const addressesService = {
  /**
   * Cadastra um novo endereço para o usuário logado (POST /addresses)
   */
  async create(payload: CreateAddressPayload): Promise<Address> {
    return api.request<Address>('/addresses', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Busca todos os endereços do usuário logado (GET /addresses/me)
   */
  async getMyAddresses(): Promise<Address[]> {
    return api.request<Address[]>('/addresses/me', {
      method: 'GET',
    });
  },

  /**
   * Lista TODOS os endereços de todos os usuários da plataforma (GET /addresses)
   */
  async getAll(): Promise<Address[]> {
    return api.request<Address[]>('/addresses', {
      method: 'GET',
    });
  },

  /**
   * Atualiza os dados de um endereço específico (PUT /addresses/:id)
   */
  async update(id: string, payload: UpdateAddressPayload): Promise<Address> {
    // Se o front enviar 'cidade', duplicamos em 'city' para blindar o destructuring do back-end
    const bodyPayload = {
      ...payload,
      city: payload.cidade || payload.city,
    };

    return api.request<Address>(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bodyPayload),
    });
  },

  /**
   * Remove um endereço por ID (DELETE /addresses/:id)
   */
  async delete(id: string): Promise<void> {
    return api.request<void>(`/addresses/${id}`, {
      method: 'DELETE',
    });
  },
};