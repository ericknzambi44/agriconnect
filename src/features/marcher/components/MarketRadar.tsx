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
    <div className="relative w-full select-none space-y-2 md:space-y-3">
      
      {/* 1. HEADER : Auto-ajustement des textes */}
      <div className="flex items-center justify-between px-1 overflow-hidden min-h-[12px]">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center shrink-0">
             <Radio className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-primary animate-pulse" />
             <div className="absolute inset-0 w-full h-full border border-primary rounded-full animate-ping opacity-20" />
          </div>
          <div className="flex items-center gap-1.5 leading-none">
            <h3 className="font-tech text-[clamp(7px,1.5vw,9px)] font-black uppercase tracking-[0.2em] text-foreground/70 whitespace-nowrap">
              RADAR_FRÉQ
            </h3>
            <div className="h-2 w-[1px] bg-border/40 hidden xs:block" />
            <span className="hidden xs:inline font-tech text-[clamp(6px,1.2vw,7px)] text-primary/40 uppercase italic font-bold">
              Ituri_04
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 opacity-60">
           <div className="hidden md:block w-12 h-[1px] bg-primary/20" />
           <span className="font-tech text-[6px] md:text-[7px] text-primary/50 font-bold uppercase whitespace-nowrap tracking-tighter">SIGNAL_LOCKED</span>
        </div>
      </div>

      {/* 2. CARROUSEL : Intelligence de réduction de largeur */}
      <div className="relative">
        {/* Masquage des bords de scroll */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background via-transparent to-transparent z-10 pointer-events-none sm:hidden" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background via-transparent to-transparent z-10 pointer-events-none sm:hidden" />

        <div className="flex gap-1.5 md:gap-2.5 overflow-x-auto pb-2 no-scrollbar px-1 snap-x">
          {streams.map((s) => {
            const isActive = activeStream === s.id;
            
            return (
              <button
                key={s.id}
                onClick={() => onStreamChange(s.id)}
                className={cn(
                  "relative flex items-center transition-all duration-500 shrink-0 outline-none group/btn snap-start",
                  "px-[clamp(0.5rem,2vw,1rem)] py-2 md:py-2.5 rounded-xl border-2 transition-all",
                  isActive 
                    ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(var(--primary),0.1)] scale-100" 
                    : "bg-secondary/30 border-border/30 hover:border-primary/20 scale-[0.98] opacity-80"
                )}
              >
                {/* Icône intelligente */}
                <div className={cn(
                  "p-1.5 md:p-2 rounded-lg transition-all shrink-0",
                  isActive 
                    ? "bg-primary text-primary-foreground rotate-0 shadow-[0_0_10px_rgba(var(--primary),0.3)]" 
                    : "bg-background/40 text-muted-foreground/40 group-hover/btn:text-primary/60 group-hover/btn:-rotate-6"
                )}>
                  <s.icon size={12} className="w-3 h-3 md:w-4 md:h-4" strokeWidth={3} />
                </div>
                
                {/* Texte à visibilité variable */}
                <div className={cn(
                  "flex flex-col items-start ml-0 md:ml-3 overflow-hidden transition-all duration-500 ease-in-out",
                  // MOBILE : On cache le texte si non actif, on le montre si actif
                  // DESKTOP : On montre toujours tout
                  isActive 
                    ? "max-w-[120px] opacity-100 ml-2" 
                    : "max-w-0 md:max-w-[100px] opacity-0 md:opacity-100 md:ml-3"
                )}>
                  <span className={cn(
                    "font-display text-[clamp(8px,1.8vw,10px)] font-black uppercase italic tracking-wider whitespace-nowrap",
                    isActive ? "text-primary" : "text-muted-foreground/70"
                  )}>
                    {s.label}
                  </span>
                  <span className="hidden lg:block font-tech text-[6px] text-muted-foreground/30 uppercase font-black tracking-widest leading-none mt-0.5">
                    {s.desc}
                  </span>
                </div>

                {/* Micro-indicateur d'activité */}
                {isActive && (
                  <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-4 h-[2px] bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
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