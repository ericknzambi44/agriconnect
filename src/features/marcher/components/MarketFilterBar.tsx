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
    <div className="relative group animate-in fade-in slide-in-from-top-4 duration-1000 w-full z-20">
      
      {/* GLOW DE FOND RADIAL */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row items-stretch lg:items-center gap-4 p-3 md:p-4 bg-secondary/90 backdrop-blur-3xl border-2 border-border rounded-[2rem] md:rounded-[2.5rem] shadow-2xl">
        
        {/* INDICATEUR DE SCAN (Console Look) */}
        <div className="hidden lg:flex items-center gap-4 pl-4 pr-3 border-r-2 border-border">
           <div className="relative flex items-center justify-center">
              <Radio size={20} className="text-primary animate-pulse relative z-10" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-ping" />
           </div>
           <div className="flex flex-col leading-none">
              <span className="font-tech text-[9px] text-primary font-black tracking-[0.2em] uppercase italic">STATUS_NODE</span>
              <span className="font-tech text-[7px] text-muted-foreground uppercase tracking-widest mt-1">Marché_Connecté</span>
           </div>
        </div>

        {/* RECHERCHE PRINCIPALE - STYLE RADAR INPUT */}
        <div className="relative flex-grow min-w-0 group/input">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
            <Target size={20} className="text-muted-foreground/40 group-focus-within/input:text-primary group-focus-within/input:rotate-90 transition-all duration-500" />
          </div>
          
          <Input 
            placeholder="RECHERCHER UN PRODUIT (TOMATES, MAÏS...)" 
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-background border-2 border-border rounded-[1.5rem] md:rounded-[2rem] pl-16 pr-4 h-16 md:h-20 font-display italic font-black text-xs md:text-sm uppercase tracking-wider text-foreground placeholder:text-muted-foreground/50 focus-visible:border-primary transition-all shadow-inner focus-visible:bg-primary/5 outline-none"
          />
          
          {/* BADGE CLAVIER (Déco Tech) */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 px-3 py-1.5 bg-secondary border-2 border-border rounded-xl opacity-40 group-focus-within/input:opacity-100 transition-opacity">
             <span className="font-tech text-[8px] text-muted-foreground font-black tracking-widest uppercase">INPUT_ACTIVE</span>
          </div>
        </div>

        {/* FILTRE CATÉGORIE - STYLE SÉLECTEUR DE DONNÉES */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Select onValueChange={onFilter} defaultValue="all">
            <SelectTrigger className="flex-1 lg:w-72 bg-background border-2 border-border rounded-[1.5rem] md:rounded-[2rem] h-16 md:h-20 font-tech font-black text-[10px] md:text-[11px] uppercase tracking-widest text-primary focus:border-primary transition-all hover:bg-primary/5 shadow-inner pl-6 data-[state=open]:border-primary">
              <div className="flex items-center gap-3">
                <LayoutGrid size={18} className="text-primary transition-transform group-hover:rotate-12" />
                <SelectValue placeholder="FILTRER_PAR_SOURCE" />
              </div>
            </SelectTrigger>
            
            <SelectContent className="bg-secondary border-2 border-border text-foreground rounded-[1.5rem] p-2 backdrop-blur-3xl shadow-2xl z-[100]">
              <SelectItem 
                  value="all" 
                  className="font-tech text-[10px] uppercase tracking-widest py-3 focus:bg-primary/10 focus:text-primary rounded-xl cursor-pointer mb-1 transition-colors"
              >
                <div className="flex items-center gap-3 font-black">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  TOUT_AFFICHER
                </div>
              </SelectItem>
              
              <div className="h-[2px] bg-border my-2 mx-2 rounded-full" />
              
              {categories.map(cat => (
                <SelectItem 
                  key={cat.id} 
                  value={cat.id.toString()} 
                  className="font-tech text-[10px] uppercase tracking-widest py-3 focus:bg-primary/10 focus:text-primary rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground/30 font-black">/</span>
                    {cat.libelle_categorie}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* BOUTON FILTRE AVANCÉ (Look Déclencheur) */}
          <button className="h-16 w-16 md:h-20 md:w-20 hidden sm:flex items-center justify-center bg-primary text-primary-foreground rounded-[1.5rem] md:rounded-[2rem] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 shrink-0 group/filter">
              <Filter size={20} className="group-hover/filter:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* FOOTER BARRE DE RECHERCHE - MÉTADONNÉES SYSTÈME */}
      <div className="flex items-center justify-between px-6 mt-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-ping" />
            <span className="font-tech text-[7px] text-muted-foreground uppercase tracking-widest font-bold">Data_Stream_On</span>
          </div>
          <div className="hidden md:flex items-center gap-2 border-l-2 border-border pl-4">
            <Zap size={10} className="text-primary/40" />
            <span className="font-tech text-[7px] text-muted-foreground uppercase tracking-widest font-bold">0ms_Latency</span>
          </div>
        </div>
        
        <span className="font-tech text-[8px] text-primary/40 uppercase tracking-[0.4em] italic font-black">
          AgriConnect_Market_zone
        </span>
      </div>
    </div>
  );
}