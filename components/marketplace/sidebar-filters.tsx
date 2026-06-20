"use client"

import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export type ProductCategory = 
  | 'TODAS'
  | 'COMIDA'
  | 'ROUPAS'
  | 'COSMETICOS'
  | 'ELETRONICOS'
  | 'SAUDE'
  | 'CASA'
  | 'BRINQUEDOS'
  | 'LIVROS'
  | 'ESPORTES'
  | 'AUTOMOTIVO'
  | 'OUTROS';

const categoryLabels: Record<ProductCategory, string> = {
  TODAS: "Todas",
  COMIDA: "Alimentos",
  ROUPAS: "Roupas",
  COSMETICOS: "Cosméticos",
  ELETRONICOS: "Eletrônicos",
  SAUDE: "Saúde",
  CASA: "Casa",
  BRINQUEDOS: "Brinquedos",
  LIVROS: "Livros",
  ESPORTES: "Esportes",
  AUTOMOTIVO: "Automotivo",
  OUTROS: "Outros",
}

interface SidebarFiltersProps {
  priceRange: number[]
  setPriceRange: (value: number[]) => void
  activeCategory: ProductCategory
  onCategoryChange: (category: ProductCategory) => void
}

export function SidebarFilters({
  priceRange,
  setPriceRange,
  activeCategory,
  onCategoryChange,
}: SidebarFiltersProps) {
  const categories: ProductCategory[] = [
    'TODAS', 'COMIDA', 'ROUPAS', 'COSMETICOS', 'ELETRONICOS', 
    'SAUDE', 'CASA', 'BRINQUEDOS', 'LIVROS', 'ESPORTES', 'AUTOMOTIVO', 'OUTROS'
  ]

  return (
    <aside className="space-y-6 h-fit sticky top-6 w-full md:max-w-[280px]">
      
      {/* Painel de Categorias */}
      <div className="bg-card rounded-2xl p-4 md:p-5 shadow-sm border border-border/40">
        <h3 className="font-semibold text-foreground mb-3 hidden md:block">Categorias</h3>
        
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide snap-x">
          {categories.map((category) => {
            const isSelected = activeCategory === category

            // Determina a cor exata com base na categoria ativa para manter o visual idêntico da imagem
            let activeBgColor = "bg-[#0070e3]" // Azul padrão para a maioria
            if (category === "COMIDA") {
              activeBgColor = "bg-[#2ecc71]" // Verde específico para Alimentos
            }

            return (
              <Button
                key={category}
                variant="ghost"
                size="sm"
                onClick={() => onCategoryChange(category)}
                className={`shrink-0 md:w-full md:justify-start font-semibold text-xs rounded-xl h-9 snap-start transition-all ${
                  isSelected
                    ? `${activeBgColor} text-white hover:opacity-90 shadow-sm shadow-black/10`
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {categoryLabels[category]}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Faixa de Preço */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/40 hidden md:block">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Faixa de Preço</h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground h-auto p-0 hover:bg-transparent hover:text-[#0070e3]"
            onClick={() => setPriceRange([0, 500])}
          >
            Resetar
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">O preço médio é R$ 150</p>
        <div className="relative pt-2">
          {/* Força a barra e os seletores do Slider a usarem o azul firme e fixo */}
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={500}
            min={0}
            step={5}
            className="w-full [&_[role=slider]]:bg-[#0070e3] [&_[role=slider]]:border-[#0070e3]"
          />
          <div className="flex justify-between mt-4 gap-2">
            {/* Badge Mínimo - Azul Sólido Fixo */}
            <div className="flex-1 text-center bg-[#0070e3] text-white px-2 py-1.5 rounded-full text-xs font-bold shadow-sm">
              R$ {priceRange[0]}
            </div>
            {/* Badge Máximo - Verde Sólido Fixo */}
            <div className="flex-1 text-center bg-[#2ecc71] text-white px-2 py-1.5 rounded-full text-xs font-bold shadow-sm">
              R$ {priceRange[1]}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}