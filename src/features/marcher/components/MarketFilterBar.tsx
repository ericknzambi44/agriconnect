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
    <div className="relative group animate-in fade-in slide-in-from-top-4 duration-700 w-full z-20">
      
      {/* GLOW DISCRET */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-[1.2rem] md:rounded-[2rem] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row items-stretch gap-2 p-2 bg-secondary/80 backdrop-blur-2xl border border-border rounded-[1.2rem] md:rounded-[2rem] shadow-xl">
        
        {/* 1. INDICATEUR DE SCAN - Visible uniquement sur grands écrans pour gagner de la place */}
        <div className="hidden lg:flex items-center gap-3 pl-3 pr-2 border-r border-border/50 shrink-0">
            <div className="relative flex items-center justify-center shrink-0">
               <Radio size={16} className="text-primary animate-pulse relative z-10" />
               <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-ping" />
            </div>
            <div className="flex flex-col leading-none min-w-[70px]">
               <span className="font-tech text-[8px] text-primary font-black tracking-widest uppercase italic">NODE_ON</span>
               <span className="font-tech text-[6px] text-muted-foreground uppercase tracking-tighter mt-0.5">CONNECTED</span>
            </div>
        </div>

        {/* 2. RECHERCHE PRINCIPALE - S'étend au maximum */}
        <div className="relative flex-grow min-w-0 group/input">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10">
            <Target size={14} className="text-muted-foreground/40 group-focus-within/input:text-primary transition-transform duration-500 md:w-4 md:h-4" />
          </div>
          
          <Input 
            placeholder="RECHERCHER..." 
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-background border border-border rounded-[0.8rem] md:rounded-[1.2rem] pl-10 pr-4 h-11 md:h-13 font-display italic font-black text-[10px] md:text-xs uppercase tracking-wider text-foreground placeholder:text-muted-foreground/30 focus-visible:ring-1 focus-visible:ring-primary transition-all shadow-inner outline-none"
          />
          
          {/* Label d'interface - Caché sur tablette/mobile pour prioriser l'espace d'écriture */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden 2xl:flex items-center gap-2 px-2 py-1 bg-secondary/50 border border-border rounded-md opacity-40">
             <span className="font-tech text-[6px] text-muted-foreground font-black tracking-widest uppercase">INPUT</span>
          </div>
        </div>

        {/* 3. FILTRE CATÉGORIE & ACTION - S'aligne sur la même ligne si l'écran le permet */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select onValueChange={onFilter} defaultValue="all">
            <SelectTrigger className="flex-1 sm:w-40 md:w-56 bg-background border border-border rounded-[0.8rem] md:rounded-[1.2rem] h-11 md:h-13 font-tech font-black text-[clamp(8px,2vw,10px)] uppercase tracking-tighter text-primary focus:ring-1 focus:ring-primary transition-all shadow-inner pl-3 pr-2">
              <div className="flex items-center gap-2 truncate">
                <LayoutGrid size={14} className="text-primary shrink-0" />
                <SelectValue placeholder="SOURCE" />
              </div>
            </SelectTrigger>
            
            <SelectContent className="bg-secondary border border-border text-foreground rounded-xl p-1 backdrop-blur-3xl z-[100] max-h-[300px]">
              <SelectItem value="all" className="font-tech text-[9px] uppercase py-2 focus:bg-primary/10 rounded-lg cursor-pointer">
                <div className="flex items-center gap-2 font-black">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  TOUT
                </div>
              </SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id.toString()} className="font-tech text-[9px] uppercase py-2 focus:bg-primary/10 rounded-lg cursor-pointer">
                  {cat.libelle_categorie}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Bouton Filtre - Taille fixe mais adaptative */}
          <button className="h-11 w-11 md:h-13 md:w-13 flex items-center justify-center bg-primary text-primary-foreground rounded-[0.8rem] md:rounded-[1.2rem] hover:opacity-90 transition-all shadow-md active:scale-95 shrink-0">
              <Filter size={18} />
          </button>
        </div>
      </div>

      {/* FOOTER - MÉTA DISCRET - Gestion intelligente des sauts de ligne */}
      <div className="flex flex-wrap items-center justify-between px-4 mt-2 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-primary/50 animate-ping" />
            <span className="font-tech text-[6px] text-muted-foreground/60 uppercase tracking-widest font-bold">STREAM_LIVE</span>
          </div>
          <div className="hidden xs:block h-2 w-[1px] bg-border" />
          <span className="hidden xs:block font-tech text-[6px] text-muted-foreground/40 uppercase">ZONE_ITURI_SEC_04</span>
        </div>
        
        <span className="font-tech text-[6px] text-primary/30 uppercase tracking-[0.2em] italic font-black whitespace-nowrap">
          Agri_connect_Interface
        </span>
      </div>
    </div>
  );
}