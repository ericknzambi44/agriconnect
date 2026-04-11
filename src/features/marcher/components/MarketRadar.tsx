// src/features/marcher/components/MarketRadar.tsx
import React from 'react';
import { Target, Zap, MapPin, TrendingDown } from "lucide-react";

export function MarketRadar({ onStreamChange, activeStream }: any) {
  const streams = [
    { id: 'trending', label: 'TENDANCES', icon: Zap, color: 'text-yellow-500' },
    { id: 'nearby', label: 'PROXIMITÉ', icon: MapPin, color: 'text-blue-500' },
    { id: 'cheap', label: 'PRIX_BAS', icon: TrendingDown, color: 'text-emerald-500' },
  ];

  return (
    <div className="flex gap-4 mb-8 overflow-x-auto pb-4 no-scrollbar">
      {streams.map((s) => (
        <button
          key={s.id}
          onClick={() => onStreamChange(s.id)}
          className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all shrink-0 ${
            activeStream === s.id 
            ? 'bg-white/10 border-white/20 text-white shadow-xl' 
            : 'bg-transparent border-white/5 text-white/30 hover:border-white/10'
          }`}
        >
          <s.icon className={`w-4 h-4 ${activeStream === s.id ? s.color : ''}`} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{s.label}</span>
        </button>
      ))}
    </div>
  );
}