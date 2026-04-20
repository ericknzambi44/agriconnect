import { Plan } from "../types";
import { Check, Clock, ArrowRight, Lock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function PlanCard({ plan, status, days, onSelect, canBuy, safetyMessage }: any) {
  const isActive = status === 'ACTIVE';

  return (
    <div className={cn(
      "relative p-5 rounded-[1.8rem] border-2 transition-all duration-300 flex flex-col h-full max-h-[440px] overflow-hidden group",
      isActive ? "bg-primary/5 border-primary shadow-xl scale-[1.02]" : "bg-secondary border-border"
    )}>
      
      {/* HEADER COMPACT */}
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "p-2.5 rounded-xl border-2 transition-colors",
          isActive ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground"
        )}>
          <Zap size={18} className={isActive ? "animate-pulse" : ""} />
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full font-tech text-[8px] font-black uppercase tracking-tighter border-2",
          isActive ? "bg-primary/10 border-primary/20 text-primary" : "bg-border/20 border-border text-muted-foreground/30"
        )}>
          {isActive ? 'NODE_ACTIF' : 'STANDBY'}
        </div>
      </div>

      {/* PRIX & NOM SERRÉS */}
      <div className="mb-5">
        <h3 className="font-display font-black italic uppercase text-lg tracking-tighter text-foreground/90 leading-none mb-2">
          {plan.nom}
        </h3>
        <div className="flex items-baseline gap-1.5">
          <span className={cn("text-4xl font-display font-black italic tracking-tighter", isActive ? "text-primary" : "text-white")}>
            {plan.prix}$
          </span>
          <span className="font-tech text-[9px] font-bold text-muted-foreground/40 uppercase">/ {plan.duree_jour}J</span>
        </div>
        
        {isActive && (
          <div className="mt-2 flex items-center gap-1.5 text-primary">
            <Clock size={12} />
            <span className="font-tech text-[10px] font-black italic uppercase tracking-tighter">{days}J RESTANTS</span>
          </div>
        )}
      </div>

      {/* FEATURES MINIMALISTES */}
      <div className="space-y-2 mb-6 flex-grow overflow-hidden">
        {plan.avantages?.slice(0, 4).map((av: string, i: number) => (
          <div key={i} className="flex items-center gap-2.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <Check size={12} className={cn("shrink-0", isActive ? "text-primary" : "text-muted-foreground/20")} strokeWidth={4} />
            <span className="font-tech text-[9px] font-bold text-foreground/80 uppercase truncate tracking-wide">{av}</span>
          </div>
        ))}
      </div>

      {/* BOUTON ACTION COMPACT */}
      <div className="mt-auto">
        <button 
          onClick={onSelect}
          disabled={!canBuy}
          className={cn(
            "w-full h-12 rounded-xl font-display font-black uppercase italic text-[11px] tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95",
            !canBuy 
              ? "bg-secondary border-2 border-border text-muted-foreground/20" 
              : isActive 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                : "bg-white text-black hover:bg-primary hover:text-white"
          )}>
          {!canBuy ? <Lock size={14}/> : isActive ? <Clock size={14}/> : <ArrowRight size={14}/>}
          {!canBuy ? "VERROUILLÉ" : isActive ? "PROLONGER" : "ACTIVER"}
        </button>

        {!canBuy && (
          <p className="mt-2 text-[8px] text-center font-tech text-error font-black uppercase tracking-tighter opacity-80">
            {safetyMessage}
          </p>
        )}
      </div>
    </div>
  );
}