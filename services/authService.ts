import { api } from './api';
import { SignInResponse, User, SignUpPayload } from '@/types/auth';

interface SignInPayload {
  email: string;
  senha: string;
}

export const authService = {
  async signIn(payload: SignInPayload): Promise<SignInResponse> {
    return api.request<SignInResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async signUp(payload: SignUpPayload): Promise<User> {
    return api.request<User>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
};