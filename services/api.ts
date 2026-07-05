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
      cache: 'no-store',
      headers,
    });

    if (!response.ok) {
      // 1. Lemos o corpo como texto primeiro para garantir que não quebre se vier vazio
      const errorText = await response.text().catch(() => "");
      let rawErrorData: any = {};
      
      try {
        if (errorText) rawErrorData = JSON.parse(errorText);
      } catch (e) {
        // Falha ao buildar o JSON do erro
      }

      // 2. Extraímos a mensagem original vinda do servidor ou do Supabase
      const serverMessage = rawErrorData.message || rawErrorData.error || "";
      
      // 3. Definimos uma mensagem padrão amigável e segura para o cliente final
      let clientMessage = "Erro interno no servidor de autenticação.";

      // 4. Mapeamento e higienização de segurança das mensagens
      if (serverMessage.includes("rate limit exceeded")) {
        clientMessage = "Muitas solicitações seguidas. Por favor, aguarde alguns minutos antes de tentar novamente.";
      } else if (serverMessage.includes("already registered") || serverMessage.includes("unique constraint")) {
        clientMessage = "Os dados informados já constam cadastrados em nosso sistema.";
      } else if (serverMessage) {
        // Se for um erro comum de validação do seu próprio backend que seja seguro expor
        clientMessage = serverMessage;
      }

      const errorData: ApiErrorResponse = {
        message: clientMessage,
        statusCode: response.status,
      };

      // Mantemos o log detalhado privado apenas no console do desenvolvedor
      console.error("[DEBUG FRONT] Erro original do servidor:", serverMessage || errorText);
      console.error("[DEBUG FRONT] Erro higienizado enviado ao componente:", errorData);
      
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