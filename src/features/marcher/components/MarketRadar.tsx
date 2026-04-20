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
      
      {/* 1. HEADER ULTRA-COMPACT (Masquable sur mobile si besoin) */}
      <div className="flex items-center justify-between px-1 overflow-hidden">
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="relative flex items-center justify-center shrink-0">
             <Radio className="w-2.5 h-2.5 md:w-3 md:h-3 text-primary animate-pulse" />
             <div className="absolute inset-0 w-2.5 h-2.5 md:w-3 md:h-3 border border-primary rounded-full animate-ping opacity-20" />
          </div>
          <div className="flex items-baseline gap-1.5 leading-none">
            <h3 className="font-tech text-[8px] md:text-[9px] font-black uppercase tracking-widest text-foreground/70 truncate">
              RADAR_FRÉQ
            </h3>
            <span className="hidden xs:inline font-tech text-[6px] md:text-[7px] text-primary/40 uppercase italic font-bold">
              Ituri_04
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
           <div className="hidden sm:block w-8 h-[1px] bg-primary/20" />
           <span className="font-tech text-[6px] md:text-[7px] text-primary/50 font-bold uppercase whitespace-nowrap">SIGNAL_STABLE</span>
        </div>
      </div>

      {/* 2. CARROUSEL AUTO-ADAPTATIF */}
      <div className="relative">
        {/* Gradients de scroll plus subtils */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 no-scrollbar px-1">
          {streams.map((s) => {
            const isActive = activeStream === s.id;
            
            return (
              <button
                key={s.id}
                onClick={() => onStreamChange(s.id)}
                className={cn(
                  "relative flex items-center transition-all duration-300 shrink-0 outline-none group/btn",
                  // Adaptation des paddings selon la taille
                  "px-2.5 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl border",
                  isActive 
                    ? "bg-primary/10 border-primary shadow-sm shadow-primary/10" 
                    : "bg-secondary/30 border-border/50 hover:border-primary/20"
                )}
              >
                {/* Icône adaptative */}
                <div className={cn(
                  "p-1 md:p-1.5 rounded-md md:rounded-lg transition-all shrink-0",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-background/40 text-muted-foreground/40 group-hover/btn:text-primary/60"
                )}>
                  <s.icon size={12} className="md:w-[14px] md:h-[14px]" strokeWidth={2.5} />
                </div>
                
                {/* Texte intelligent : Se cache sur très petit écran ou réduit sa taille */}
                <div className={cn(
                  "flex flex-col items-start ml-2 md:ml-3 transition-all overflow-hidden",
                  // Sur mobile ultra-petit (<380px), on réduit la largeur si pas actif
                  !isActive && "max-w-0 opacity-0 sm:max-w-xs sm:opacity-100",
                  isActive && "max-w-xs opacity-100"
                )}>
                  <span className={cn(
                    "font-display text-[8px] md:text-[9px] font-black uppercase italic tracking-tight md:tracking-wider whitespace-nowrap",
                    isActive ? "text-primary" : "text-muted-foreground/70"
                  )}>
                    {s.label}
                  </span>
                  <span className="hidden md:block font-tech text-[6px] text-muted-foreground/30 uppercase font-bold tracking-tighter leading-none">
                    {s.desc}
                  </span>
                </div>

                {/* Indicateur de focus (plus propre) */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary scale-x-75 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}