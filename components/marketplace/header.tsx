"use client"

import { Search, User, Plus, LogOut, Settings, Sun, Moon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "next-themes"

interface HeaderProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function Header({ searchTerm, onSearchChange }: HeaderProps) {
  // Consumindo a autenticação e o objeto do usuário diretamente do seu contexto centralizado
  const { isAuthenticated, user, logout } = useAuth()
  
  // Consumindo o controle de tema
  const { theme, setTheme } = useTheme()

  // Define dinamicamente o link e o texto baseados na role do usuário
  const isAdmin = user?.role === "ADMIN"
  const actionLink = isAdmin ? "/admin" : "/vender"
  const actionText = isAdmin ? "Gerenciar" : "Anunciar"

  return (
    <header className="bg-card rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-SlxyaNw3rFjpUjlARilGNd1fo9ZQjp.jpeg"
            alt="Entre Equipistas"
            width={48}
            height={48}
            className="rounded-lg"
          />
          <span className="font-bold text-lg text-foreground hidden md:inline">
            Entre Equipistas
          </span>
        </Link>

        {/* Search */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por produto, vendedor, cidade..."
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Botão de Alternar Tema (Claro/Escuro) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 border border-input rounded-md"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
            <span className="sr-only">Alternar tema</span>
          </Button>

          {/* Botão Anunciar / Gerenciar */}
          <Link href={actionLink}>
            <Button variant="outline" size="sm" className="gap-2 border-primary text-primary hover:bg-primary/10">
              {isAdmin ? <Settings className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span className="hidden sm:inline">{actionText}</span>
            </Button>
          </Link>

          {/* Botão Condicional: Sair ou Entrar baseado no AuthContext */}
          {isAuthenticated ? (
            <Button 
              size="sm" 
              variant="destructive"
              onClick={logout}
              className="gap-2 bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          ) : (
            <Link href="/login">
              <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Entrar</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}