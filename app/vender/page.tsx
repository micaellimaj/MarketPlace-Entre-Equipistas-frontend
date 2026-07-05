"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Package,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { productsService } from "@/services/productsService"
import { addressesService } from "@/services/addressesService"
import { Product, ProductCategory } from "@/types/products"
import { Address } from "@/types/addresses"

const categories: { label: string; value: ProductCategory }[] = [
  { label: "Alimentos", value: "COMIDA" },
  { label: "Roupas", value: "ROUPAS" },
  { label: "Cosméticos", value: "COSMETICOS" },
  { label: "Eletrônicos", value: "ELETRONICOS" },
  { label: "Saúde", value: "SAUDE" },
  { label: "Casa", value: "CASA" },
  { label: "Brinquedos", value: "BRINQUEDOS" },
  { label: "Livros", value: "LIVROS" },
  { label: "Esportes", value: "ESPORTES" },
  { label: "Automotivo", value: "AUTOMOTIVO" },
  { label: "Outros", value: "OUTROS" },
]

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

function ProductImageCarousel({ imagens, nome }: { imagens: string[]; nome: string }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const listImagens = imagens && imagens.length > 0 ? imagens : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"]

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIdx((prev) => (prev + 1) % listImagens.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIdx((prev) => (prev - 1 + listImagens.length) % listImagens.length)
  }

  return (
    <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-muted group">
      <Image
        src={listImagens[currentIdx]}
        alt={`${nome} - Imagem ${currentIdx + 1}`}
        fill
        className="object-cover"
      />
      {listImagens.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white font-medium">
            {currentIdx + 1} / {listImagens.length}
          </div>
        </>
      )}
    </div>
  )
}

export default function SellerDashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<"products" | "addresses">("products")
  const [products, setProducts] = useState<Product[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)

  // Estado global de Notificações (Toast)
  const [toast, setToast] = useState<ToastState | null>(null)

  // Estados de Produto
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    categoria: "" as ProductCategory,
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  // Estados de Endereço
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [isAddressSubmitting, setIsAddressSubmitting] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [addressFormData, setAddressFormData] = useState({
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    complemento: "",
  })

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  async function loadInitialData() {
    try {
      setLoading(true)
      const [productsData, addressesData] = await Promise.all([
        productsService.getMyProducts(),
        addressesService.getMyAddresses(),
      ])
      setProducts(productsData)
      setAddresses(addressesData)
    } catch (error) {
      console.error("Erro ao carregar dados iniciais:", error)
      showNotification("Erro ao sincronizar dados com o servidor.", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login')
      } else if (user.role === 'ADMIN') {
        router.push('/admin')
      }
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      loadInitialData();
    }
  }, []);

  async function loadProducts() {
    try {
      const data = await productsService.getMyProducts()
      setProducts(data)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: "",
      preco: "",
      categoria: "COMIDA",
    })
    setSelectedFiles([])
    setEditingProduct(null)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      nome: product.nome,
      descricao: product.descricao,
      preco: product.preco.toString(),
      categoria: product.categoria,
    })
    setSelectedFiles([])
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingProduct) {
        await productsService.update({
          id: editingProduct.id,
          nome: formData.nome,
          descricao: formData.descricao,
          preco: parseFloat(formData.preco),
          categoria: formData.categoria,
          imagens: selectedFiles.length > 0 ? selectedFiles : undefined, 
        })
        showNotification(`Produto "${formData.nome}" atualizado com sucesso!`)
      } else {
        await productsService.create({
          nome: formData.nome,
          descricao: formData.descricao,
          preco: parseFloat(formData.preco),
          categoria: formData.categoria,
          imagens: selectedFiles,
        })
        showNotification(`Novo produto "${formData.nome}" anunciado com sucesso!`)
      }
      setIsDialogOpen(false)
      resetForm()
      await loadProducts()
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
      showNotification("Não foi possível salvar os dados do produto.", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await productsService.delete(id)
      showNotification("Anúncio do produto removido permanentemente.", "success")
      loadProducts()
    } catch (error) {
      console.error("Erro ao deletar produto:", error)
      showNotification("Erro ao tentar remover o produto.", "error")
    }
  }

  async function loadAddresses() {
    try {
      const data = await addressesService.getMyAddresses()
      setAddresses(data)
    } catch (error) {
      console.error("Erro ao carregar endereços:", error)
    }
  }

  const resetAddressForm = () => {
    setAddressFormData({
      cep: "",
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      complemento: "",
    })
    setEditingAddress(null)
  }

  const openAddAddressDialog = () => {
    resetAddressForm()
    setIsAddressDialogOpen(true)
  }

  const openEditAddressDialog = (address: Address) => {
    setEditingAddress(address)
    setAddressFormData({
      cep: address.cep,
      rua: address.rua,
      numero: address.numero,
      bairro: address.bairro,
      cidade: address.cidade,
      estado: address.estado,
      complemento: address.complemento || "",
    })
    setIsAddressDialogOpen(true)
  }

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddressSubmitting(true)

    try {
      if (editingAddress) {
        await addressesService.update(editingAddress.id, {
          cep: addressFormData.cep,
          rua: addressFormData.rua,
          numero: addressFormData.numero,
          bairro: addressFormData.bairro,
          cidade: addressFormData.cidade,
          estado: addressFormData.estado,
          complemento: addressFormData.complemento || undefined,
        })
        showNotification("Endereço de coleta atualizado com sucesso!")
      } else {
        await addressesService.create({
          cep: addressFormData.cep,
          rua: addressFormData.rua,
          numero: addressFormData.numero,
          bairro: addressFormData.bairro,
          cidade: addressFormData.cidade,
          estado: addressFormData.estado,
          complemento: addressFormData.complemento || undefined,
        })
        showNotification("Novo endereço de coleta vinculado!")
      }
      setIsAddressDialogOpen(false)
      resetAddressForm()
      await loadAddresses()
    } catch (error) {
      console.error("Erro ao salvar endereço:", error)
      showNotification("Erro ao tentar salvar as informações residenciais.", "error")
    } finally {
      setIsAddressSubmitting(false)
    }
  }

  const handleAddressDelete = async (id: string) => {
    try {
      await addressesService.delete(id)
      showNotification("Endereço de coleta removido de sua conta.", "success")
      loadAddresses()
    } catch (error) {
      console.error("Erro ao deletar endereço:", error)
      showNotification("Não foi possível excluir este endereço.", "error")
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Carregando seus dados...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Marketplace
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Painel do Vendedor</h1>
            <p className="text-muted-foreground">
              Gerencie seus anúncios e seus endereços de coleta de forma integrada
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "products" ? (
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open)
                if (!open) resetForm()
              }}>
                <DialogTrigger asChild>
                  {/* Botão Novo Produto Travado no Azul Fixo */}
                  <Button className="bg-[#0070e3] hover:bg-[#0070e3]/90 text-white gap-2 font-semibold rounded-xl" onClick={openAddDialog}>
                    <Plus className="h-4 w-4" />
                    Novo Produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? "Editar Produto" : "Adicionar Produto"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome do Produto</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Ex: Camiseta Estonada Preta"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        placeholder="Descreva as especificações do seu produto..."
                        rows={3}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="preco">Preço (R$)</Label>
                        <Input
                          id="preco"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.preco}
                          onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                          placeholder="0.00"
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="categoria">Categoria</Label>
                        <Select
                          value={formData.categoria}
                          onValueChange={(value: ProductCategory) => setFormData({ ...formData, categoria: value })}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imagens">
                        {editingProduct ? "Substituir Imagens (Opcional)" : "Imagens do Produto"}
                      </Label>
                      <Input
                        key={editingProduct ? editingProduct.id : "new-product"}
                        id="imagens"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files) {
                            setSelectedFiles(Array.from(e.target.files))
                          }
                        }}
                        required={!editingProduct}
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-muted-foreground">
                        {editingProduct 
                          ? "Selecione novos arquivos caso queira substituir todas as imagens atuais." 
                          : "Selecione até 5 arquivos de imagem simultaneamente."}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 rounded-xl"
                        disabled={isSubmitting}
                        onClick={() => {
                          setIsDialogOpen(false)
                          resetForm()
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="flex-1 bg-[#0070e3] hover:bg-[#0070e3]/90 text-white gap-2 font-semibold rounded-xl" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        {editingProduct ? "Salvar Alterações" : "Cadastrar Produto"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog open={isAddressDialogOpen} onOpenChange={(open) => {
                setIsAddressDialogOpen(open)
                if (!open) resetAddressForm()
              }}>
                <DialogTrigger asChild>
                  {/* Botão Novo Endereço Travado no Azul Fixo */}
                  <Button className="bg-[#0070e3] hover:bg-[#0070e3]/90 text-white gap-2 font-semibold rounded-xl" onClick={openAddAddressDialog}>
                    <Plus className="h-4 w-4" />
                    Novo Endereço
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingAddress ? "Editar Endereço" : "Adicionar Endereço"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddressSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="cep">CEP</Label>
                        <Input
                          id="cep"
                          value={addressFormData.cep}
                          onChange={(e) => setAddressFormData({ ...addressFormData, cep: e.target.value })}
                          placeholder="00000-000"
                          required
                          disabled={isAddressSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="numero">Número</Label>
                        <Input
                          id="numero"
                          value={addressFormData.numero}
                          onChange={(e) => setAddressFormData({ ...addressFormData, numero: e.target.value })}
                          placeholder="123"
                          required
                          disabled={isAddressSubmitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rua">Logradouro / Rua</Label>
                      <Input
                        id="rua"
                        value={addressFormData.rua}
                        onChange={(e) => setAddressFormData({ ...addressFormData, rua: e.target.value })}
                        placeholder="Ex: Av. Principal"
                        required
                        disabled={isAddressSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bairro">Bairro</Label>
                      <Input
                        id="bairro"
                        value={addressFormData.bairro}
                        onChange={(e) => setAddressFormData({ ...addressFormData, bairro: e.target.value })}
                        placeholder="Ex: Centro"
                        required
                        disabled={isAddressSubmitting}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input
                          id="cidade"
                          value={addressFormData.cidade}
                          onChange={(e) => setAddressFormData({ ...addressFormData, cidade: e.target.value })}
                          placeholder="Ex: Toritama"
                          required
                          disabled={isAddressSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estado">Estado (UF)</Label>
                        <Input
                          id="estado"
                          value={addressFormData.estado}
                          onChange={(e) => setAddressFormData({ ...addressFormData, estado: e.target.value })}
                          placeholder="Ex: PE"
                          maxLength={2}
                          required
                          disabled={isAddressSubmitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="complemento">Complemento (Opcional)</Label>
                      <Input
                        id="complemento"
                        value={addressFormData.complemento}
                        onChange={(e) => setAddressFormData({ ...addressFormData, complemento: e.target.value })}
                        placeholder="Ex: Bloco A, Apto 102"
                        disabled={isAddressSubmitting}
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 rounded-xl"
                        disabled={isAddressSubmitting}
                        onClick={() => {
                          setIsAddressDialogOpen(false)
                          resetAddressForm()
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="flex-1 bg-[#0070e3] hover:bg-[#0070e3]/90 text-white gap-2 font-semibold rounded-xl" disabled={isAddressSubmitting}>
                        {isAddressSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        {editingAddress ? "Salvar Alterações" : "Cadastrar Endereço"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Painel de Métricas Rápidas com Cores Vivas e Bordas no Escuro */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card dark:bg-zinc-900/50 rounded-xl p-4 shadow-sm border border-border/60">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#0070e3]/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-[#0070e3]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{products.length}</p>
                <p className="text-sm text-muted-foreground">Produtos Ativos</p>
              </div>
            </div>
          </div>

          <div className="bg-card dark:bg-zinc-900/50 rounded-xl p-4 shadow-sm border border-border/60">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#2ecc71]/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-[#2ecc71]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{addresses.length}</p>
                <p className="text-sm text-muted-foreground">Endereços Cadastrados</p>
              </div>
            </div>
          </div>

          <div className="bg-card dark:bg-zinc-900/50 rounded-xl p-4 shadow-sm border border-border/60">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#0070e3]/10 flex items-center justify-center">
                <span className="text-base font-bold text-[#0070e3]">R$</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {products.reduce((sum, p) => sum + (p.preco || 0), 0).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Valor Total do Catálogo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="flex gap-4 border-b border-muted mb-6">
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === "products" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Produtos
            {activeTab === "products" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0070e3] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("addresses")}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === "addresses" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Meus Endereços
            {activeTab === "addresses" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0070e3] rounded-full" />
            )}
          </button>
        </div>

        {/* Renderização Condicional da Aba Ativa */}
        {activeTab === "products" ? (
          products.length === 0 ? (
            <div className="bg-card dark:bg-zinc-900/50 border border-border/50 rounded-2xl p-12 text-center shadow-sm">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Você ainda não possui produtos cadastrados
              </h3>
              <p className="text-muted-foreground mb-4">
                Comece adicionando seu primeiro produto para exibi-lo no marketplace.
              </p>
              <Button className="bg-[#0070e3] hover:bg-[#0070e3]/90 text-white gap-2 font-semibold rounded-xl" onClick={openAddDialog}>
                <Plus className="h-4 w-4" />
                Adicionar Produto
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-card dark:bg-zinc-900/50 border border-border/60 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <ProductImageCarousel imagens={product.imagens} nome={product.nome} />
                  <div className="space-y-2 mt-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground line-clamp-1 text-sm">{product.nome}</h3>
                      <span className="text-[11px] font-semibold uppercase bg-muted px-2 py-0.5 rounded-md text-muted-foreground shrink-0 dark:bg-muted/40">
                        {categories.find(c => c.value === product.categoria)?.label || product.categoria}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{product.descricao}</p>
                    <p className="text-base font-bold text-[#0070e3]">R$ {(product.preco || 0).toFixed(2)}</p>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-1 rounded-xl text-xs" onClick={() => openEditDialog(product)}>
                        <Pencil className="h-3 w-3" />
                        Editar
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. O produto será removido permanentemente da sua loja.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-red-600 text-white hover:bg-red-700 rounded-xl">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          addresses.length === 0 ? (
            <div className="bg-card dark:bg-zinc-900/50 border border-border/50 rounded-2xl p-12 text-center shadow-sm">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum endereço cadastrado
              </h3>
              <p className="text-muted-foreground mb-4">
                Adicione um endereço de coleta para que os compradores possam retirar ou receber produtos.
              </p>
              <Button className="bg-[#0070e3] hover:bg-[#0070e3]/90 text-white gap-2 font-semibold rounded-xl" onClick={openAddAddressDialog}>
                <Plus className="h-4 w-4" />
                Adicionar Endereço
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="bg-card dark:bg-zinc-900/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-border/60 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#0070e3]">
                      <MapPin className="h-5 w-5 shrink-0" />
                      <span className="font-bold text-sm">CEP: {address.cep}</span>
                    </div>
                    <div className="text-sm text-foreground space-y-1">
                      <p className="font-semibold">{address.rua}, Nº {address.numero}</p>
                      <p className="text-muted-foreground text-xs">{address.bairro}</p>
                      <p className="text-muted-foreground text-xs">{address.cidade} - {address.estado}</p>
                      {address.complemento && (
                        <p className="text-xs bg-muted px-2 py-1 rounded inline-block text-muted-foreground mt-1 dark:bg-muted/40">
                          Ref: {address.complemento}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 mt-4 border-t border-muted/50">
                    <Button variant="outline" size="sm" className="flex-1 gap-1 rounded-xl text-xs" onClick={() => openEditAddressDialog(address)}>
                      <Pencil className="h-3 w-3" />
                      Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir endereço?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover este endereço? Esta ação não poderá ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleAddressDelete(address.id)} className="bg-red-600 text-white hover:bg-red-700 rounded-xl">
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Toast Flutuante de Notificação */}
        {toast && (
          <div className="fixed bottom-4 right-4 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg bg-card text-foreground animate-in slide-in-from-bottom-5 fade-in duration-300 max-w-sm">
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-[#2ecc71] shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive shrink-0" />
            )}
            <span className="text-xs font-semibold">{toast.message}</span>
          </div>
        )}
      </div>
    </div>
)
}