export interface User {
  id: string;
  email: string;
  cpf: string;
  nome: string;
  telefone: string;
  status: 'ATIVO' | 'INATIVO';
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface SignInResponse {
  user: User;
  session: SupabaseSession;
}

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
}

export interface SignUpPayload {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  senha: string;
}