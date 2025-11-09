"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/use-categories";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Wrench,
  Hammer,
  Plug,
  MoreHorizontal,
  Home,
  Car,
  Camera,
  Scissors,
  Wrench as PipeWrench,
  Paintbrush,
  Dumbbell,
  Palette,
  Sofa,
  WashingMachine,
  Bug,
  TreePine,
  PartyPopper,
  Utensils,
  Music,
  Baby,
  GraduationCap,
  AirVent,
  User,
  Search,
  Star,
} from "lucide-react";

// Icon mapping for categories
const getCategoryIcon = (slug: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    vidraceiro: Wrench,
    "transporte-frete": Car,
    gesseiro: Hammer,
    "fotografo-filmagem": Camera,
    "pedreiro-reforma": Hammer,
    pintor: Paintbrush,
    "personal-trainer": Dumbbell,
    maquiagem: Palette,
    "montador-de-moveis": Sofa,
    "manutencao-eletrodomesticos": WashingMachine,
    dedetizacao: Bug,
    jardinagem: TreePine,
    encanador: PipeWrench,
    "decoracao-eventos": PartyPopper,
    buffet: Utensils,
    piscineiro: Home,
    "designer-grafico": Palette,
    chaveiro: Wrench,
    serralheiro: Wrench,
    "mudanca-carretos": Car,
    "suporte-de-informatica": Wrench,
    "funilaria-automotiva": Car,
    "mecanico-automotivo": Wrench,
    cabeleireiro: Scissors,
    "limpeza-residencial": Sparkles,
    outros: MoreHorizontal,
    eletricista: Plug,
    marceneiro: Hammer,
    "manicure-pedicure": Scissors,
    "dj-som": Music,
    "cuidador-idosos": User,
    "instalador-ar-condicionado": AirVent,
    baba: Baby,
    "professor-particular": GraduationCap,
  };

  return iconMap[slug] || MoreHorizontal;
};

// Popular categories (most used)
const POPULAR_CATEGORIES = [
  "limpeza-residencial",
  "eletricista",
  "encanador",
  "pintor",
  "mecanico-automotivo",
  "cabeleireiro",
  "jardinagem",
  "montador-de-moveis",
];

// Category groups for better organization
const CATEGORY_GROUPS = {
  "Casa e Reforma": [
    "limpeza-residencial",
    "pintor",
    "pedreiro-reforma",
    "gesseiro",
    "marceneiro",
    "vidraceiro",
    "encanador",
    "eletricista",
    "jardinagem",
    "dedetizacao",
    "piscineiro",
  ],
  Automotivo: [
    "mecanico-automotivo",
    "funilaria-automotiva",
    "mudanca-carretos",
    "transporte-frete",
  ],
  "Beleza e Bem-estar": [
    "cabeleireiro",
    "maquiagem",
    "manicure-pedicure",
    "personal-trainer",
  ],
  "Tecnologia e Suporte": [
    "suporte-de-informatica",
    "designer-grafico",
    "fotografo-filmagem",
  ],
  "Eventos e Festas": ["decoracao-eventos", "buffet", "dj-som"],
  Cuidados: ["baba", "cuidador-idosos"],
  Educação: ["professor-particular"],
  Outros: ["outros"],
};

const getCategoryGroup = (slug: string): string => {
  for (const [groupName, categories] of Object.entries(CATEGORY_GROUPS)) {
    if (categories.includes(slug)) {
      return groupName;
    }
  }
  return "Outros";
};

interface ServiceTypeCardsProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  active: boolean;
}

export function ServiceTypeCards({
  selectedType,
  onSelect,
}: ServiceTypeCardsProps) {
  const { data: categories, isLoading, error } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter and organize categories
  const { popularCategories, groupedCategories, filteredCategories } =
    useMemo(() => {
      if (!categories)
        return {
          popularCategories: [],
          groupedCategories: {},
          filteredCategories: [],
        };

      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const popular = filtered.filter((cat) =>
        POPULAR_CATEGORIES.includes(cat.slug)
      );
      const grouped = filtered.reduce((acc, category) => {
        const group = getCategoryGroup(category.slug);
        if (!acc[group]) acc[group] = [];
        acc[group].push(category);
        return acc;
      }, {} as Record<string, typeof categories>);

      return {
        popularCategories: popular,
        groupedCategories: grouped,
        filteredCategories: filtered,
      };
    }, [categories, searchTerm]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="p-3 rounded-lg border bg-background animate-pulse"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-muted h-6 w-6" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Erro ao carregar categorias. Tente novamente.
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma categoria disponível.
      </div>
    );
  }

  const renderCategoryCard = (category: Category, isPopular = false) => {
    const Icon = getCategoryIcon(category.slug);
    const isSelected = selectedType === category.slug;

    return (
      <button
        key={category.id}
        type="button"
        onClick={() => onSelect(category.slug)}
        className={cn(
          "p-3 rounded-lg border transition-all duration-200 text-left group",
          "hover:border-primary/50 hover:shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          isSelected
            ? "border-primary bg-primary/5 shadow-sm"
            : "border-input bg-background hover:bg-accent/50"
        )}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "p-1.5 rounded-md transition-colors",
              isSelected
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground group-hover:bg-primary/10"
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <span
            className={cn(
              "font-medium text-sm transition-colors truncate",
              isSelected ? "text-primary" : "text-foreground"
            )}
          >
            {category.name}
          </span>
          {isPopular && <Star className="h-3 w-3 text-amber-500 ml-auto" />}
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Popular Categories */}
      {!searchTerm && popularCategories.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            <h3 className="font-medium text-sm">Mais Procurados</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {popularCategories.map((category) =>
              renderCategoryCard(category, true)
            )}
          </div>
        </div>
      )}

      {/* Grouped Categories */}
      {!searchTerm ? (
        <div className="space-y-4">
          {Object.entries(groupedCategories).map(
            ([groupName, groupCategories]) => (
              <div key={groupName} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm text-foreground">
                    {groupName}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {groupCategories.length}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {groupCategories.map((category) =>
                    renderCategoryCard(category)
                  )}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        /* Search Results */
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium text-sm">
              Resultados para &quot;{searchTerm}&quot; (
              {filteredCategories.length})
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredCategories.map((category) => renderCategoryCard(category))}
          </div>
          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma categoria encontrada para &quot;{searchTerm}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
