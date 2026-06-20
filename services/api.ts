import { ApiErrorResponse } from '@/types/auth';

const BASE_URL = process.env.NEXT_PUBLIC_BACK_URL;

export const api = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!BASE_URL) {
      throw new Error('A variável de ambiente BACK_URL não foi definida.');
    }
    console.log(`[DEBUG FRONT] 3. Disparando requisição HTTP para: ${BASE_URL}${endpoint}`);
    console.log(`[DEBUG FRONT] Payload enviado no Body:`, options.body);
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('@marketplace:token') : null;

    const headers = new Headers(options.headers);
    if (headers.has('X-Multipart-Request')) {
      headers.delete('X-Multipart-Request');
    } else {
      headers.set('Content-Type', 'application/json');
    }
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json().catch(() => ({
        message: 'Erro interno no servidor de autenticação.',
        statusCode: response.status,
      }));
      console.error("[DEBUG FRONT] Erro na requisição API:", errorData);
      throw errorData;
    }

    // LENDO O CORPO COMO TEXTO PRIMEIRO PARA EVITAR QUEBRA NO HTTP 204 (DELETE)
    const text = await response.text();
    
    // Se a resposta vier vazia, retorna um objeto vazio mapeado para o tipo T
    if (!text) {
      return {} as T;
    }

    // Se houver conteúdo, faz o parse do JSON normalmente
    return JSON.parse(text) as T;
  }
};