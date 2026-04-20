import React from 'react';
import { Target, Zap, MapPin, TrendingDown, Layers, Activity, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketRadarProps {
  onStreamChange: (streamId: string) => void;
  activeStream: string;
}

export function MarketRadar({ onStreamChange, activeStream }: MarketRadarProps) {
  const streams = [
    { id: 'all', label: 'FLUX_GLOBAL', icon: Layers, desc: 'Toutes les unités' },
    { id: 'trending', label: 'TENDANCES', icon: Zap, desc: 'Forte demande' },
    { id: 'nearby', label: 'PROXIMITÉ', icon: MapPin, desc: 'Rayon local' },
    { id: 'cheap', label: 'PRIX_BAS', icon: TrendingDown, desc: 'Opportunités' },
  ];

  return (
    <div className="relative w-full select-none space-y-4">
      
      {/* 1. INDICATEUR DE BALAYAGE RADAR */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
             <Radio className="w-4 h-4 text-primary animate-pulse" />
             <div className="absolute inset-0 w-4 h-4 border border-primary rounded-full animate-ping opacity-20" />
          </div>
          <div className="leading-none">
            <h3 className="font-tech text-[10px] font-black uppercase tracking-[0.4em] text-foreground">
              RADAR_FRÉQUENCE
            </h3>
            <p className="font-tech text-[7px] text-muted-foreground uppercase italic tracking-widest mt-0.5">
              Scan_ituri_sector_04
            </p>
          </div>
        </div>
        
        {/* Ligne de status technique */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            <span className="font-tech text-[7px] text-primary font-bold uppercase tracking-widest">Signal_Stable</span>
          </div>
        </div>
      </div>

      {/* 2. CARROUSEL DE FLUX (Scroll Horizontal) */}
      <div className="relative group">
        {/* Effet de fondu sur les côtés pour le scroll */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex gap-3 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth px-6 md:px-2">
          {streams.map((s) => {
            const isActive = activeStream === s.id;
            
            return (
              <button
                key={s.id}
                onClick={() => onStreamChange(s.id)}
                className={cn(
                  "relative flex items-center gap-4 px-5 py-4 rounded-[1.2rem] border-2 transition-all duration-500 shrink-0 outline-none",
                  "active:scale-95 group/btn",
                  isActive 
                    ? "bg-primary/5 border-primary shadow-[0_15px_30px_rgba(var(--primary),0.1)] translate-y-[-2px]" 
                    : "bg-secondary/50 border-border hover:border-primary/30 hover:bg-secondary"
                )}
              >
                {/* Icône avec Glow */}
                <div className={cn(
                  "p-2.5 rounded-xl transition-all duration-500",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-glow-primary rotate-[10deg]" 
                    : "bg-background text-muted-foreground/40 group-hover/btn:text-primary/60"
                )}>
                  <s.icon size={16} strokeWidth={2.5} />
                </div>
                
                <div className="flex flex-col items-start gap-1">
                  <span className={cn(
                    "font-display text-[11px] font-black uppercase italic tracking-[0.15em] transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground/60"
                  )}>
                    {s.label}
                  </span>
                  <span className="font-tech text-[7px] text-muted-foreground/40 uppercase font-bold tracking-tighter">
                    {isActive ? "Connexion_Active" : s.desc}
                  </span>
                </div>

                {/* Barre de sélection basse */}
                {isActive && (
                  <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        .shadow-glow-primary {
          box-shadow: 0 0 15px rgba(var(--primary), 0.4);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}