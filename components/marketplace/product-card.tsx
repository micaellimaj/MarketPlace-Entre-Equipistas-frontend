"use client"

import { useState } from "react"
import Image from "next/image"
import { Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export interface Product {
  id: string
  name: string
  description: string
  category: string
  city: string
  images: string[]
  price: number
  isOwnProduct?: boolean
  seller: {
    name: string
    phone: string
    email: string
    whatsappLink: string
    emailLink: string
  }
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  const productImages = product.images?.length > 0 
    ? product.images 
    : ["https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=400&fit=crop"]

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  // Verifica se a descrição é longa o suficiente para precisar do botão
  const isLongDescription = product.description.length > 60

  return (
    <div className="group bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col justify-between border border-border/50">
      
      {/* Badge: Seu Produto - Blindado com o Azul Firme Sólido */}
      {product.isOwnProduct && (
        <span className="absolute top-4 left-4 z-20 bg-[#0070e3] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-md">
          Seu Produto
        </span>
      )}

      {/* Top Section */}
      <div>
        {/* Image Carousel */}
        <div className="relative bg-muted/30 rounded-xl overflow-hidden mb-3 aspect-square group/carousel">
          <Image
            src={productImages[currentImageIndex]}
            alt={`${product.name} - Imagem ${currentImageIndex + 1}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {productImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-black/80 hover:bg-white text-foreground rounded-full p-1 shadow-md opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-black/80 hover:bg-white text-foreground rounded-full p-1 shadow-md opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1 bg-black/30 px-2 py-1 rounded-full backdrop-blur-[2px]">
                {productImages.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                      index === currentImageIndex ? "bg-white scale-125" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          {/* Categoria & Cidade */}
          <div className="flex justify-between items-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>{product.category}</span>
            <span className="text-foreground/80 font-medium normal-case bg-muted px-2 py-0.5 rounded-md dark:bg-muted/60">
              📍 {product.city}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-semibold text-foreground line-clamp-2 text-sm leading-tight pt-0.5">
            {product.name}
          </h3>

          {/* Description */}
          <div>
            <p className={`text-xs text-muted-foreground leading-relaxed ${!isExpanded ? "line-clamp-2" : ""}`}>
              {product.description}
            </p>
            {isLongDescription && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[11px] font-semibold text-[#0070e3] hover:underline mt-0.5 block"
              >
                {isExpanded ? "Ver menos" : "Ver mais"}
              </button>
            )}
          </div>

          {/* Seller */}
          <p className="text-xs text-muted-foreground pt-0.5">
            Vendedor: <span className="font-medium text-foreground">{product.seller.name}</span>
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-3 pt-2 border-t border-muted/50">
        {/* Price - Exibido no Azul Sólido Fixo para a Identidade */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base font-bold text-[#0070e3]">
            R$ {product.price.toFixed(2)}
          </span>
        </div>

        {/* Contact Button / Own Product State */}
        {product.isOwnProduct ? (
          <div className="w-full text-center text-xs font-medium text-muted-foreground bg-muted p-2.5 rounded-xl border border-dashed dark:bg-muted/30">
            Item publicado por você
          </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              {/* Botão Entrar em Contato Travado no Azul Fixo */}
              <Button className="w-full bg-[#0070e3] hover:bg-[#0070e3]/90 text-white rounded-xl text-xs h-9 font-semibold shadow-sm transition-colors">
                Entrar em Contato
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Contato do Vendedor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Avatar do Vendedor Usando o Azul Fixo */}
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg dark:bg-muted/50">
                  <div className="h-12 w-12 rounded-full bg-[#0070e3]/10 flex items-center justify-center dark:bg-[#0070e3]/20">
                    <span className="text-lg font-bold text-[#0070e3]">
                      {product.seller.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{product.seller.name}</p>
                    <p className="text-sm text-muted-foreground">Vendedor</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* WhatsApp Link - Verde Sólido Fixo */}
                  <a
                    href={product.seller.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-[#2ecc71]/10 hover:bg-[#2ecc71]/20 rounded-lg transition-colors group border border-[#2ecc71]/10"
                  >
                    <Phone className="h-5 w-5 text-[#2ecc71]" />
                    <div>
                      <p className="text-xs text-muted-foreground">WhatsApp (Clique para conversar)</p>
                      <p className="font-semibold text-foreground group-hover:text-[#2ecc71] transition-colors">
                        {product.seller.phone}
                      </p>
                    </div>
                  </a>

                  {/* E-mail Link - Azul Sólido Fixo */}
                  <a
                    href={product.seller.emailLink}
                    className="flex items-center gap-3 p-3 bg-[#0070e3]/10 hover:bg-[#0070e3]/20 rounded-lg transition-colors group border border-[#0070e3]/10"
                  >
                    <Mail className="h-5 w-5 text-[#0070e3]" />
                    <div>
                      <p className="text-xs text-muted-foreground">E-mail (Enviar mensagem)</p>
                      <p className="font-semibold text-foreground group-hover:text-[#0070e3] transition-colors">
                        {product.seller.email}
                      </p>
                    </div>
                  </a>
                </div>

                <p className="text-[11px] text-muted-foreground text-center leading-normal">
                  Entre em contato diretamente com o vendedor para negociar e finalizar a compra de forma segura.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}