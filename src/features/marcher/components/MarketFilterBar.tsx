import React from 'react';
import { Search, Filter, LayoutGrid, Zap, Radio, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Props {
  categories: any[];
  onSearch: (val: string) => void;
  onFilter: (catId: string) => void;
}

export function MarketFilterBar({ categories, onSearch, onFilter }: Props) {
  return (
    <div className="relative group animate-in fade-in slide-in-from-top-4 duration-1000">
      
      {/* GLOW DE FOND RADIAL */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      <div className="relative flex flex-col lg:flex-row items-stretch lg:items-center gap-4 p-3 md:p-4 bg-[#080808]/80 backdrop-blur-3xl border border-white/5 rounded-[2.2rem] md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* INDICATEUR DE SCAN (COUPÉ SUR MOBILE) */}
        <div className="hidden lg:flex items-center gap-3 pl-4 pr-2 border-r border-white/5">
           <div className="relative">
              <Radio className="w-5 h-5 text-emerald-500 animate-pulse" />
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md animate-ping" />
           </div>
           <div className="flex flex-col">
              <span className="font-tech text-[8px] text-emerald-500 font-black tracking-[0.2em] uppercase">Status</span>
              <span className="font-tech text-[7px] text-white/20 uppercase tracking-widest">Marcher en ligne</span>
           </div>
        </div>

        {/* RECHERCHE PRINCIPALE - STYLE RADAR */}
        <div className="relative flex-grow min-w-0 group/input">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
            <Target className="w-5 h-5 text-emerald-500/40 group-focus-within/input:text-emerald-500 group-focus-within/input:rotate-90 transition-all duration-500" />
          </div>
          
          <Input 
            placeholder="RECHERCHER UN PRODUIT (TOMATE, MAÏS, ETC)..." 
            onChange={(e) => onSearch(e.target.value)}
            className="bg-white/[0.02] border-white/5 rounded-[1.8rem] md:rounded-[2.5rem] pl-16 h-16 md:h-20 font-display italic font-black text-xs md:text-sm uppercase tracking-wider text-white placeholder:text-white/10 focus-visible:ring-emerald-500/20 transition-all focus-visible:bg-emerald-500/[0.03] focus-visible:border-emerald-500/30"
          />
          
          {/* PETIT BADGE DE RACCOURCI */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl opacity-40 group-focus-within/input:opacity-100 transition-opacity">
             <span className="font-tech text-[8px] text-white font-bold tracking-widest uppercase"></span>
          </div>
        </div>

        {/* FILTRE CATÉGORIE - STYLE MODULE DE DONNÉES */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Select onValueChange={onFilter} defaultValue="all">
            <SelectTrigger className="flex-1 lg:w-80 bg-[#0A0A0A] border-white/5 rounded-[1.8rem] md:rounded-[2.5rem] h-16 md:h-20 font-tech font-black text-[10px] md:text-[11px] uppercase tracking-widest text-emerald-500/60 pl-8 focus:ring-emerald-500/20 transition-all hover:bg-white/[0.02] shadow-inner">
              <div className="flex items-center gap-4">
                <LayoutGrid className="w-5 h-5 text-emerald-500 transition-transform group-hover:rotate-12" />
                <SelectValue placeholder="FILTRER_PAR_SOURCE" />
              </div>
            </SelectTrigger>
            
            <SelectContent className="bg-[#0A0A0A] border-white/10 text-white rounded-[2rem] p-2 backdrop-blur-3xl shadow-3xl">
              <SelectItem 
                  value="all" 
                  className="font-tech text-[10px] uppercase tracking-widest py-4 focus:bg-emerald-500 focus:text-black rounded-2xl cursor-pointer mb-1"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  🌐 Tout Categorie
                </div>
              </SelectItem>
              
              <div className="h-[1px] bg-white/5 my-2 mx-4" />
              
              {categories.map(cat => (
                <SelectItem 
                  key={cat.id} 
                  value={cat.id.toString()} 
                  className="font-tech text-[10px] uppercase tracking-widest py-4 focus:bg-emerald-500 focus:text-black rounded-2xl cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white/20">/</span>
                    {cat.libelle_categorie}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* BOUTON FILTRE AVANCÉ (OPTIONNEL VISUEL) */}
          <button className="h-16 w-16 md:h-20 md:w-20 hidden sm:flex items-center justify-center bg-emerald-500 text-black rounded-[1.8rem] md:rounded-[2.5rem] hover:bg-emerald-400 transition-all shadow-[0_10px_20px_rgba(16,185,129,0.2)] active:scale-90 shrink-0">
              <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* FOOTER BARRE DE RECHERCHE - MÉTADONNÉES */}
      <div className="flex items-center justify-between px-8 mt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

          </div>
          <div className="hidden md:flex items-center gap-2 border-l border-white/5 pl-4">
            <Zap className="w-3 h-3 text-emerald-500/40" />
            
          </div>
        </div>
        
        <span className="font-tech text-[7px] text-emerald-500/40 uppercase tracking-[0.4em] italic font-black">
          AgriConnect_Market
        </span>
      </div>
    </div>
  );
}