import React from 'react';
import { Zap, MapPin, TrendingDown, Layers, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketRadarProps {
  onStreamChange: (streamId: string) => void;
  activeStream: string;
}

export function MarketRadar({ onStreamChange, activeStream }: MarketRadarProps) {
  const streams = [
    { id: 'all', label: 'GLOBAL', icon: Layers, desc: 'UNITÉS' },
    { id: 'trending', label: 'TREND', icon: Zap, desc: 'DEMANDE' },
    { id: 'nearby', label: 'LOCAL', icon: MapPin, desc: 'PROXIM' },
    { id: 'cheap', label: 'OFFRES', icon: TrendingDown, desc: 'PRIX_BAS' },
  ];

  return (
    <div className="relative w-full select-none space-y-1.5 md:space-y-2">
      
      {/* 1. HEADER : Minimaliste & High-Tech */}
      <div className="flex items-center justify-between px-1.5 opacity-80">
        <div className="flex items-center gap-1.5">
          <div className="relative h-2 w-2">
             <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-40" />
             <div className="relative h-2 w-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
          </div>
          <h3 className="font-tech text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
            RADAR_<span className="text-foreground">FLUX</span>
          </h3>
        </div>
        
        <div className="flex items-center gap-1">
           <span className="font-tech text-[6px] text-primary/40 font-bold uppercase tracking-tighter">BUNIA_ZONE_04</span>
           <div className="w-1 h-1 rounded-full bg-border" />
        </div>
      </div>

      {/* 2. CARROUSEL : Puces (Chips) compactes avec Gradients */}
      <div className="relative group">
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1.5 no-scrollbar px-0.5 snap-x">
          {streams.map((s) => {
            const isActive = activeStream === s.id;
            
            return (
              <button
                key={s.id}
                onClick={() => onStreamChange(s.id)}
                className={cn(
                  "relative flex items-center transition-all duration-300 shrink-0 outline-none snap-start",
                  "h-8 md:h-10 px-3 md:px-4 rounded-lg border-[1px] transition-all",
                  isActive 
                    ? "bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent border-primary/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
                    : "bg-secondary/20 border-border/20 hover:border-primary/30 hover:bg-secondary/40"
                )}
              >
                {/* Icône Ultra-Fine */}
                <s.icon 
                  size={12} 
                  className={cn(
                    "transition-all",
                    isActive ? "text-primary scale-110" : "text-muted-foreground/40"
                  )} 
                  strokeWidth={isActive ? 3 : 2} 
                />
                
                {/* Texte : On utilise une typo serrée pour gagner de la place */}
                <div className={cn(
                  "flex flex-col items-start overflow-hidden transition-all duration-300",
                  isActive ? "max-w-[80px] ml-2 opacity-100" : "max-w-0 md:max-w-[70px] opacity-0 md:opacity-60 md:ml-2"
                )}>
                  <span className={cn(
                    "font-display text-[9px] md:text-[10px] font-black uppercase italic tracking-tight whitespace-nowrap",
                    isActive ? "text-primary" : "text-foreground"
                  )}>
                    {s.label}
                  </span>
                  {/* Petit descripteur invisible sur mobile pour la clarté */}
                  <span className="hidden md:block font-tech text-[5px] text-muted-foreground/40 uppercase font-black tracking-[0.2em] -mt-0.5">
                    {s.desc}
                  </span>
                </div>

                {/* Glow discret en bas si actif */}
                {isActive && (
                  <div className="absolute inset-x-0 -bottom-[1px] h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}