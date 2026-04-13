// src/features/marcher/components/MarketRadar.tsx
import React from 'react';
import { Target, Zap, MapPin, TrendingDown, Layers, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketRadarProps {
  onStreamChange: (streamId: string) => void;
  activeStream: string;
}

export function MarketRadar({ onStreamChange, activeStream }: MarketRadarProps) {
  const streams = [
    { id: 'all', label: 'FLUX_GLOBAL', icon: Layers, color: 'text-white' },
    { id: 'trending', label: 'TENDANCES', icon: Zap, color: 'text-yellow-400' },
    { id: 'nearby', label: 'PROXIMITÉ', icon: MapPin, color: 'text-blue-400' },
    { id: 'cheap', label: 'PRIX_BAS', icon: TrendingDown, color: 'text-emerald-400' },
  ];

  return (
    <div className="relative group select-none">
      {/* Label de section style Radar - Plus discret */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
          <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.5em] text-white/30 italic font-tech">
            Source_Flux / Radar_Actif
          </span>
        </div>
        <div className="h-[1px] flex-grow mx-4 bg-white/5 hidden md:block" />
      </div>

      <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth px-1">
        {streams.map((s) => {
          const isActive = activeStream === s.id;
          
          return (
            <button
              key={s.id}
              onClick={() => onStreamChange(s.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 shrink-0",
                "active:scale-95",
                isActive 
                  ? "bg-emerald-500/10 border-emerald-500/40 text-white shadow-[0_10px_20px_rgba(0,0,0,0.4)]" 
                  : "bg-[#0A0A0A] border-white/5 text-white/30 hover:border-white/10"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                isActive ? "bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-white/5"
              )}>
                <s.icon className="w-3 h-3 md:w-3.5 md:h-3.5" />
              </div>
              
              <div className="flex flex-col items-start leading-none">
                <span className={cn(
                  "text-[9px] font-display font-black uppercase italic tracking-widest",
                  isActive ? "text-emerald-500" : "text-white/40"
                )}>
                  {s.label}
                </span>
                {isActive && (
                  <span className="text-[6px] font-tech text-white/40 mt-1 uppercase tracking-tighter">
                    Sync_OK
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}