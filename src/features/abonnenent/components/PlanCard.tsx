// features/subscription/components/PlanCard.tsx
import { Plan } from "../types";
import { Check, Clock, ArrowRight, Lock, Zap, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  plan: Plan;
  status?: string;
  days?: number;
  onSelect: () => void;
  canBuy: boolean;
  safetyMessage?: string;
}

export function PlanCard({ plan, status, days, onSelect, canBuy, safetyMessage }: PlanCardProps) {
  const isActive = status === 'ACTIF';

  return (
    <div className={cn(
      "relative p-5 rounded-[2rem] border-2 transition-all duration-500 flex flex-col h-full max-h-[440px] overflow-hidden group",
      isActive 
        ? "bg-gradient-to-b from-primary/10 to-black/60 border-primary shadow-2xl shadow-primary/20 scale-[1.02]" 
        : "bg-gradient-to-b from-white/[0.02] to-black/40 border-white/10 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
    )}>
      
      {/* OVERLAY LUMINEUX AU SURVOL */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* HEADER */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={cn(
          "p-2.5 rounded-xl border-2 transition-all duration-300",
          isActive 
            ? "bg-gradient-to-r from-primary to-orange-400 text-black border-primary shadow-lg" 
            : "bg-black/40 border-white/10 text-white/50 group-hover:border-primary/30"
        )}>
          <Zap size={18} className={isActive ? "animate-pulse" : ""} />
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full font-tech text-[8px] font-black uppercase tracking-tighter border-2 backdrop-blur-sm",
          isActive 
            ? "bg-primary/20 border-primary/40 text-primary shadow-[0_0_8px_rgba(var(--primary),0.4)]" 
            : "bg-white/5 border-white/10 text-white/30"
        )}>
          {isActive ? 'NŒUD ACTIF' : 'STANDBY'}
        </div>
      </div>

      {/* PRIX & NOM */}
      <div className="mb-5 relative z-10">
        <h3 className="font-display font-black italic uppercase text-lg tracking-tighter text-white leading-none mb-2">
          {plan.nom}
        </h3>
        <div className="flex items-baseline gap-1.5">
          <span className={cn(
            "text-4xl font-display font-black italic tracking-tighter drop-shadow-md",
            isActive ? "text-primary" : "text-white"
          )}>
            {plan.prix}$
          </span>
          <span className="font-tech text-[9px] font-bold text-white/40 uppercase">/ {plan.duree_jour}J</span>
        </div>
        
        {isActive && (
          <div className="mt-2 flex items-center gap-1.5 text-primary bg-primary/10 inline-flex px-2 py-0.5 rounded-full">
            <Clock size={12} className="animate-pulse" />
            <span className="font-tech text-[10px] font-black italic uppercase tracking-tighter">{days}J RESTANTS</span>
          </div>
        )}
      </div>

      {/* FEATURES (limitées à 4) */}
      <div className="space-y-2 mb-6 flex-grow overflow-hidden relative z-10">
        {plan.avantages?.slice(0, 4).map((av: string, i: number) => (
          <div key={i} className="flex items-center gap-2.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <Check size={12} className={cn("shrink-0", isActive ? "text-primary" : "text-white/20")} strokeWidth={4} />
            <span className="font-tech text-[9px] font-bold text-white/70 uppercase truncate tracking-wide">{av}</span>
          </div>
        ))}
      </div>

      {/* BOUTON ACTION */}
      <div className="mt-auto relative z-10">
        <button 
          onClick={onSelect}
          disabled={!canBuy}
          className={cn(
            "w-full h-12 rounded-xl font-display font-black uppercase italic text-[11px] tracking-widest flex items-center justify-center gap-3 transition-all duration-300 active:scale-95",
            !canBuy 
              ? "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed" 
              : isActive 
                ? "bg-gradient-to-r from-primary to-orange-400 text-black shadow-lg shadow-primary/30 hover:shadow-xl" 
                : "bg-white text-black hover:bg-primary hover:text-black hover:shadow-lg hover:shadow-primary/30"
          )}>
          {!canBuy ? <Lock size={14} /> : isActive ? <Clock size={14} /> : <ArrowRight size={14} />}
          {!canBuy ? "VERROUILLÉ" : isActive ? "PROLONGER" : "ACTIVER"}
        </button>

        {!canBuy && safetyMessage && (
          <p className="mt-2 text-[8px] text-center font-tech text-red-400 font-black uppercase tracking-tighter opacity-90">
            {safetyMessage}
          </p>
        )}
      </div>
    </div>
  );
}