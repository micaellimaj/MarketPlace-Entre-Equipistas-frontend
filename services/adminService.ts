import { api } from './api';
import { AdminUser, UserStatus, UpdateUserAdminPayload } from '@/types/admin';

export const adminService = {
  /**
   * Lista todos os usuários cadastrados na plataforma com seus respectivos
   * endereços e produtos vinculados (GET /admin/users)
   */
  async listAllUsers(): Promise<AdminUser[]> {
    return api.request<AdminUser[]>('/admin/users', {
      method: 'GET',
    });
  },

  /**
   * Altera o status de um usuário entre ATIVO e INATIVO (PATCH /admin/users/:id/status)
   * Retorna void pois o controller responde com status HTTP 204
   */
  async changeStatus(id: string, status: UserStatus): Promise<void> {
    return api.request<void>(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Atualiza os dados cadastrais, endereços ou produtos de um usuário (PUT /admin/users/:id)
   */
  async updateUser(id: string, payload: UpdateUserAdminPayload): Promise<AdminUser> {
    return api.request<AdminUser>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Remove permanentemente um usuário do sistema (DELETE /admin/users/:id)
   * O banco de dados remove em cascata os produtos e endereços vinculados
   */
  async deleteUser(id: string): Promise<void> {
    return api.request<void>(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
};