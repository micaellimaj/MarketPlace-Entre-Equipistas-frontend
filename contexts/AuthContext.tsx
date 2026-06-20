'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, ApiErrorResponse, SignUpPayload } from '@/types/auth';
import { authService } from '@/services/authService';

interface SignInCredentials {
  email: string;
  senha: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: SignInCredentials) => Promise<void>;
  register: (data: SignUpPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('@marketplace:token');
    const storedUser = localStorage.getItem('@marketplace:user');

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async ({ email, senha }: SignInCredentials) => {
    setLoading(true);
    console.log("[DEBUG FRONT] 2. Função login() iniciada no AuthContext com:", { email, senha });
    
    try {
      const data = await authService.signIn({ email, senha });
      console.log("[DEBUG FRONT] data recebida do back-end:", data);

      localStorage.setItem('@marketplace:token', data.session.access_token);
      localStorage.setItem('@marketplace:user', JSON.stringify(data.user));
      
      // Log de segurança para escrita de cookies
      document.cookie = `@marketplace:token=${data.session.access_token}; path=/; max-age=${data.session.expires_in}; SameSite=Lax; Secure`;
      console.log("[DEBUG FRONT] Token e cookies armazenados com sucesso.");

      setUser(data.user);
      if (data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/vender');
      }
    } catch (error) {
      console.error("[DEBUG FRONT] Erro dentro do bloco catch do AuthContext:", error);
      throw error;
    } finally {
      setLoading(false);
    }
};

  const register = async (payload: SignUpPayload) => {
    setLoading(true);
    try {
      await authService.signUp(payload);
      router.push('/login'); 
    } catch (error) {
      throw error as ApiErrorResponse;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('@marketplace:token');
    localStorage.removeItem('@marketplace:user');
    document.cookie = '@marketplace:token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);