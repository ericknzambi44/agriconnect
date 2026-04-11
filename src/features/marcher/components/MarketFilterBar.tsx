// src/features/marcher/components/MarketFilterBar.tsx
import React from 'react';
import { Search, Filter, LayoutGrid, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  categories: any[];
  onSearch: (val: string) => void;
  onFilter: (catId: string) => void;
}

export function MarketFilterBar({ categories, onSearch, onFilter }: Props) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 md:gap-6 bg-white/[0.02] p-4 md:p-6 rounded-[2rem] md:rounded-[3rem] border border-white/5 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
      {/* EFFET DE LUMIÈRE DISCRET */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/5 blur-[100px] pointer-events-none" />

      {/* SECTION RECHERCHE : S'adapte à la largeur disponible */}
      <div className="relative flex-grow min-w-0">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50 group-hover:text-emerald-500 transition-colors" />
        <Input 
          placeholder="SCANNER LE RÉSEAU (PRODUIT)..." 
          onChange={(e) => onSearch(e.target.value)}
          className="bg-[#050505]/60 border-white/10 rounded-2xl md:rounded-3xl pl-14 h-14 md:h-16 font-black text-[10px] md:text-[11px] uppercase tracking-widest text-white placeholder:text-white/10 focus-visible:ring-emerald-500/30 transition-all border-dashed focus-visible:border-emerald-500/50"
        />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 hidden md:block">
            <Zap className="w-3 h-3 text-white/5 animate-pulse" />
        </div>
      </div>

      {/* SECTION FILTRE : Pleine largeur sur mobile, fixe sur desktop */}
      <div className="flex items-center gap-3 w-full lg:w-auto">
        <div className="hidden sm:flex items-center justify-center h-14 w-14 bg-white/[0.02] border border-white/5 rounded-2xl text-white/20">
            <Filter className="w-4 h-4" />
        </div>
        
        <Select onValueChange={onFilter} defaultValue="all">
          <SelectTrigger className="flex-1 lg:w-72 bg-[#050505]/60 border-white/10 rounded-2xl md:rounded-3xl h-14 md:h-16 font-black text-[10px] md:text-[11px] uppercase tracking-tighter text-white/60 pl-6 focus:ring-emerald-500/20 border-dashed transition-all">
            <div className="flex items-center gap-3">
              <LayoutGrid className="w-4 h-4 text-emerald-500" />
              <SelectValue placeholder="TOUTES_CATÉGORIES" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-[#080808] border-white/10 text-white font-black uppercase text-[10px] rounded-2xl backdrop-blur-3xl shadow-3xl">
            <SelectItem 
                value="all" 
                className="focus:bg-emerald-500 focus:text-black transition-colors py-3 cursor-pointer"
            >
              🌐 FLUX_GLOBAL
            </SelectItem>
            {categories.map(cat => (
              <SelectItem 
                key={cat.id} 
                value={cat.id} 
                className="focus:bg-emerald-500 focus:text-black transition-colors py-3 cursor-pointer"
              >
                📂 {cat.libelle_categorie}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* INDICATEUR DE STATUT MOBILE */}
      <div className="flex lg:hidden items-center justify-center gap-2 pt-2 opacity-30">
        <div className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Système_Filtre_Actif</span>
      </div>
    </div>
  );
}