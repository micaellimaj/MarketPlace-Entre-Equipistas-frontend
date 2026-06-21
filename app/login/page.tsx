"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Mail, Lock, Phone, FileText, CheckCircle2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const { login, register } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Estados de feedback visual para o Cadastro
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [registerError, setRegisterError] = useState("")

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  const [nome, setNome] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [telefone, setTelefone] = useState("")
  const [regSenha, setRegSenha] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login({ email, senha })
      toast({
        title: "Sucesso!",
        description: "Login realizado com sucesso.",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error.message || "Falha ao tentar autenticar.",
      })
    } finally {
      setIsLoading(false)
    }
  }

    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      setRegisterSuccess(false)
      setRegisterError("")

      // Remove máscaras (pontos, traços, espaços) para enviar dados limpos
      const cleanCpf = cpf.replace(/\D/g, "")
      const cleanTelefone = telefone.replace(/\D/g, "")

      try {
        await register({
          nome,
          email: regEmail,
          cpf: cleanCpf,
          telefone: cleanTelefone,
          senha: regSenha,
        })
        
        // Se chegou aqui, deu certo!
        setRegisterSuccess(true)

        toast({
          title: "Cadastro realizado!",
          description: "Sua conta foi criada e aguarda aprovação.",
        })
        
        // Limpa os campos do formulário APENAS em caso de sucesso
        setNome("")
        setRegEmail("")
        setCpf("")
        setTelefone("")
        setRegSenha("")

      } catch (error: any) {
        // Pega a mensagem que já foi higienizada lá no api.ts (ex: "Muitas solicitações seguidas...")
        const errorMsg = error.message || "Falha ao tentar cadastrar."
        
        setRegisterError(errorMsg)
        
        toast({
          variant: "destructive",
          title: "Erro no cadastro",
          description: errorMsg,
        })
      } finally {
        setIsLoading(false)
      }
    }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Marketplace
        </Link>

        <div className="bg-card rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col items-center mb-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-SlxyaNw3rFjpUjlARilGNd1fo9ZQjp.jpeg"
              alt="Entre Equipistas"
              width={80}
              height={80}
              className="rounded-xl mb-4"
              style={{ width: '80px', height: 'auto' }}
            />
            <h1 className="text-2xl font-bold text-foreground">Entre Equipistas</h1>
            <p className="text-muted-foreground text-sm">Compre e venda entre amigos</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                      
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </div>
                          
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="ex: José da Silva"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      className="pl-10"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      className="pl-10"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="********"
                      className="pl-10"
                      value={regSenha}
                      onChange={(e) => setRegSenha(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Bloco de Mensagem de Sucesso na Tela */}
                {registerSuccess && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex gap-3 text-emerald-600 dark:text-emerald-400 text-sm">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-semibold">Cadastro solicitado com sucesso!</p>
                      <p className="mt-0.5 opacity-90">Sua conta foi enviada para análise. Você poderá fazer login assim que o administrador liberar o seu acesso.</p>
                    </div>
                  </div>
                )}

                {/* Bloco de Mensagem de Erro na Tela */}
                {registerError && (
                  <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3 text-destructive text-sm">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-semibold">Não foi possível cadastrar</p>
                      <p className="mt-0.5 opacity-90">{registerError}</p>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}